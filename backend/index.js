const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const cors = require('cors');

require('dotenv').config({ path: '.env.local' });

let translationClient;
let projectId;
const location = 'global';
const {TranslationServiceClient} = require('@google-cloud/translate');

if(process.env.GOOGLE_CREDENTIALS_BASE64) {
  const decodedKey = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('ascii');
  const credentials = JSON.parse(decodedKey);
  projectId=credentials.project_id;
  translationClient=new TranslationServiceClient({credentials});
  console.log('Google Cloud credentials configured successfully.');
} else {
  console.error('!!! CRITICAL: GOOGLE_CREDENTIALS_BASE64 env var not set. Translation will fail. !!!');
}

const PORT = process.env.PORT || 4000;
const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;


const app = express();
app.use(cors());

const server = http.createServer(app);
const frontEndURL = process.env.FRONTEND_URL;
console.log("The frontEndURL: ", frontEndURL);
const io = new Server(server, {
  cors: {
    origin: frontEndURL,
    methods: ["GET", "POST"]
  }
});

let userPreferences = {};       //Key: socket.Id,  Value: {userName, TranslationLanguage}


// --- Agora Token Generation Endpoint ---
const nocache = (_, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
};

const generateToken = (req, res) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    console.error('Agora credentials not configured on the server.');
    return res.status(500).json({ 'error': 'Agora credentials not configured.' });
  }

  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ 'error': 'channelName is a required parameter.' });
  }

  const uid = 0; // Or assign a unique integer user ID
  // const uid = req.query.userId;
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // Token valid for 1 hour
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;
  console.log("User ID: ", uid);
  
  try {
    const token = RtcTokenBuilder.buildTokenWithUid(AGORA_APP_ID, AGORA_APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    console.log(`Token successfully generated for channel: ${channelName}`);
    return res.json({ 'token': token });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    return res.status(500).json({ 'error': 'Failed to generate Agora token.' });
  }
};

app.get('/get_token', nocache, generateToken);


// --- Socket.IO Connection for Chat & Translation ---
io.on('connection', (socket)=>{
  console.log(`User connected via Socket.IO: ${socket.id}`);

  socket.on('join-chat-room', ({roomId, userName, targetLang})=>{
    if (!roomId || !userName || !targetLang) {
      console.error(`[join-chat-room] Invalid data received from ${socket.id}`);
      return;
    }
    socket.join(roomId);
    userPreferences[`${socket.id}`] = { userName, targetLang };
  });

  socket.on('chat-message', async({text, room, sourceLang})=>{
    try {
      const sender = userPreferences[`${socket.id}`];
      if(!sender) return;

      console.log(`Message from ${sender.userName}: "${text}"`);

      const clientsInRoom = await io.in(room).fetchSockets();
      for(const clientSocket of clientsInRoom)
      {
        if(clientSocket.id===socket.id) continue;

        const receiver = userPreferences[clientSocket.id];
        if(!receiver) continue;

        let translatedText = text;
        const receiverTargetLang = receiver.targetLang;
        const senderSourceLang = sourceLang.split('-')[0];

        if (receiverTargetLang !== senderSourceLang) {
          try {
            const request = {
                  parent: `projects/${projectId}/locations/global`,
                  contents: [text],
                  mimeType: 'text/plain',
                  targetLanguageCode: receiverTargetLang,
              };
            if (sourceLang && sourceLang !== 'auto') {
                request.sourceLanguageCode = senderSourceLang;
            }
            
            const [response] = await translationClient.translateText(request);
            translatedText = response.translations[0]?.translatedText || text;
          } catch (error) {
              console.error(`Translation failed for ${clientSocket.id}:`, error);
              translatedText = `[Translation Error] ${text}`;
          }
        }

        io.to(clientSocket.id).emit('chat-message', {
          translatedText: translatedText,
          originalText:text,
          senderName: sender.userName,
        });
      }
    } catch(error) {
      console.error('ERROR during v3 translation:', error);
      socket.to(room).emit('chat-message', {
        translatedText: `[Translation Failed] ${text}`,
        originalText: text,
        senderName: userName || "Unknown"
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected from Socket.IO: ${socket.id}`);
  });

});



server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});