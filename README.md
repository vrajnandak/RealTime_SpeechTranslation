# Lingua Live

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Break language barriers with real-time, translated video conversations. Lingua Live is a web application that allows multiple users to join a video call and communicate seamlessly, even if they don't speak the same language.

**Test It Yourself:** [**https://timely-fox-dcd3d7.netlify.app**](https://speechtranslationtask1finalround.netlify.app)

---

## The Problem It Solves

In an increasingly globalized world, communication is key. However, language barriers can be a significant obstacle to effective collaboration and connection. Traditional video conferencing tools require users to find external translation services, which are slow and disruptive. Lingua Live solves this by integrating live transcription and translation directly into the video call experience, allowing for a natural and fluid conversation between speakers of different languages.

## Core Features

*   **Multi-User Group Video Calls:** High-quality, low-latency video and audio powered by Agora's global Real-Time Engagement network.
*   **Real-time Speech-to-Text:** Utilizes the browser's built-in Web Speech API to instantly transcribe a user's spoken words.
*   **Live, Automatic Translation:** Leverages the Google Cloud Translation API to translate the transcribed text into each participant's desired language in real-time.
*   **Dynamic Chat Interface:** A custom-built chat sidebar displays the translated messages, allowing users to follow the conversation naturally.
*   **Custom Video Call UI:** A modern, responsive user interface with custom controls for muting the microphone, disabling the camera, and leaving the call.
*   **Secure & Scalable Backend:** A Node.js server that handles secure token generation for Agora and real-time message broadcasting with Socket.IO.
*   **Fully Free Deployment:** The entire application is deployed on a free-tier stack using Netlify for the frontend and Render for the backend.

## Technology Stack

This project is a full-stack monorepo, with the frontend and backend managed in separate packages.

#### **Frontend**
*   **Framework:** React 19 (with Vite)
*   **Routing:** React Router DOM
*   **Video/Audio:** Agora RTC React SDK
*   **Real-time Messaging:** Socket.IO Client
*   **Speech Recognition:** Web Speech API (Browser Native)
*   **Styling:** Custom CSS with a modern, responsive design

#### **Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Real-time Messaging:** Socket.IO
*   **Video Authentication:** Agora Token Server (agora-token)
*   **Translation:** Google Cloud Translation API v3 (`@google-cloud/translate`)

#### **Deployment & APIs**
*   **Frontend Hosting:** Netlify
*   **Backend Hosting:** Render
*   **Video/Audio API:** Agora
*   **Translation API:** Google Cloud Translate

## Project Structure
├── backend/ # Node.js & Express server  
│ ├── node_modules/  
│ ├── index.js # Main server file for tokens & sockets  
│ └── package.json  
│  
├── frontend/ # React (Vite) application  
│ ├── public/  
│ │ └── logo.svg # Application Logo  
│ ├── src/  
│ │ ├── pages/ # Page components  
│ │ │ ├── LandingPage.jsx  
│ │ │ ├── Lobby.jsx  
│ │ │ └── VideoCall.jsx  
│ │ ├── App.css  
│ │ ├── App.jsx # Main router setup  
│ │ ├── index.css # Global styles & fonts  
│ │ └── main.jsx # Entry point for React  
│ ├── .env.local # Local environment variables  
│ ├── .npmrc # Fixes peer dependency issues on deploy  
│ └── package.json  
│  
└── README.md # You are here!  

