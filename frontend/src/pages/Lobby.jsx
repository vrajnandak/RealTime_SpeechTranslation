import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_RENDER_URL;

const Lobby = ({room, setRoom, userID, userName, setUserName, myLanguage, setMyLanguage, translationLanguage, setTranslationLanguage, setToken}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!room.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            console.log("backendURL: ", backendURL);
            const response = await fetch(`${backendURL}/get_token?channelName=${room}&userId=${userID}`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            if (!data.token) {
                throw new Error('Token not received from server');
            }
            
            setToken(data.token);
            navigate(`/room/${room}`);
        } catch (err) {
            console.error("Failed to join room", err);
            setError("Failed to join room. The server might be waking up. Please try again in 30 seconds.");
            setIsLoading(false);
        }
    };

    return (
    <div className="lobby-card">
      <form onSubmit={handleSubmit} className="lobby-form">
        <div className="form-group">
          <label htmlFor="userName">Your Name</label>
          <input 
            id="userName"
            type="text" 
            placeholder="e.g., Jane Doe" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            disabled={isLoading} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="roomName">Room Name</label>
          <input 
            id="roomName"
            type="text" 
            placeholder="e.g., project-sync" 
            value={room} 
            onChange={(e) => setRoom(e.target.value)} 
            required 
            disabled={isLoading} 
          />
        </div>
        <div className="language-selects">
          <div className="form-group">
            <label>I will speak in:</label>
            <select value={myLanguage} onChange={(e) => setMyLanguage(e.target.value)} disabled={isLoading}>
              <option value="auto">Auto-detect</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
              <option value="de-DE">Deutsch</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
              <option value="ja-JP">日本語 (Japanese)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Translate peer messages to:</label>
            <select value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} disabled={isLoading}>
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ja">日本語 (Japanese)</option>
            </select>
          </div>
        </div>
        <button type="submit" className="join-btn" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join Room'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Lobby;