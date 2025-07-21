import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import the new landing page
import VideoCall from './pages/VideoCall';
import './App.css';

const Footer = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/' && (
        <footer className="attribution-footer">
          <p>A project by Vrajnandak Nangunoori</p>
        </footer>
      )}
    </>
  );
};

function App() {
  const [room, setRoom] = useState('');
  const [userID, setUserID] = useState(Math.floor(Math.random() * 65536));
  const [userName, setUserName] = useState('');
  const [myLanguage, setMyLanguage] = useState('en-US');
  const [translationLanguage, setTranslationLanguage] = useState('es');
  const [token, setToken] = useState(null);

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              // The root path now renders the LandingPage component
              <LandingPage 
                room={room} 
                setRoom={setRoom}
                userID={userID}
                userName={userName}
                setUserName={setUserName}
                myLanguage={myLanguage}
                setMyLanguage={setMyLanguage}
                translationLanguage={translationLanguage}
                setTranslationLanguage={setTranslationLanguage}
                setToken={setToken}
              />
            } 
          />
          <Route 
            path="/room/:roomCode" 
            element={
              <VideoCall 
                userID={userID}
                userName={userName}
                myLanguage={myLanguage} 
                translationLanguage={translationLanguage}
                token={token}
              />
            } 
          />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;