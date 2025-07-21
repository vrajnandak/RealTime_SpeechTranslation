// frontend/src/pages/Lobby.jsx
import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_RENDER_URL || "https://trilogy-r2-speechtranslationtool.onrender.com";

// A curated list of common languages for the Speech Recognition API
const speechLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'ja-JP', name: '日本語 (Japanese)' },
  { code: 'ko-KR', name: '한국어 (Korean)' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'ru-RU', name: 'Русский (Russian)' },
  { code: 'zh-CN', name: '中文 (Mandarin, China)' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
  { code: 'ar-SA', name: 'العربية (Arabic)' },
  { code: 'nl-NL', name: 'Nederlands' },
];

// A comprehensive list of target languages for the Google Cloud Translation API
const translationLanguages = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'sq', name: 'Albanian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hy', name: 'Armenian' },
    { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' },
    { code: 'be', name: 'Belarusian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'hr', name: 'Croatian' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' },
    { code: 'et', name: 'Estonian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'gl', name: 'Galician' },
    { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' },
    { code: 'km', name: 'Khmer' },
    { code: 'ko', name: 'Korean' },
    { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'mk', name: 'Macedonian' },
    { code: 'ms', name: 'Malay' },
    { code: 'mt', name: 'Maltese' },
    { code: 'mr', name: 'Marathi' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'es', name: 'Spanish' },
    { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' },
];


const Lobby = ({ room, setRoom, userID, userName, setUserName, myLanguage, setMyLanguage, translationLanguage, setTranslationLanguage, setToken }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!room.trim() || !userName.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${backendUrl}/get_token?channelName=${room}&userId=${userID}`);
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
            <select className="language-dropdown" value={myLanguage} onChange={(e) => setMyLanguage(e.target.value)} disabled={isLoading}>
              {speechLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Translate peer messages to:</label>
            {/* THE FIX: Now maps over the much larger translationLanguages array */}
            <select className="language-dropdown" value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} disabled={isLoading}>
              {translationLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
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