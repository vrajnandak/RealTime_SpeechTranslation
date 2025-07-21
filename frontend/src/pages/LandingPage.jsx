import React from 'react';
import Lobby from './Lobby';

const LandingPage = (props) => {
  return (
    <div className="landing-container">
      {/* --- Left Column: Instructions --- */}
      <div className="landing-info">
        <h1 className="landing-title">Lingua Live</h1>
        <p className="landing-subtitle">Break language barriers with real-time, translated video conversations.</p>
        
        <h3 className="instructions-title">How It Works</h3>
        <ul className="instructions-list">
          <li>
            <strong>1. Create a Room:</strong> Enter any name for your meeting room.
          </li>
          <li>
            <strong>2. Select Languages:</strong> Choose the language you will speak, and the language you want your peer's speech translated into.
          </li>
          <li>
            <strong>3. Share & Join:</strong> Share the room name with your peer so they can join with their own language settings.
          </li>
          <li>
            <strong>4. Speak Freely:</strong> Your speech is automatically transcribed and translated, appearing live in the chat sidebar for your peer to read.
          </li>
        </ul>

      </div>

      {/* --- Right Column: The Lobby Form --- */}
      <div className="landing-form">
        <Lobby {...props} />
      </div>
    </div>
  );
};

export default LandingPage;