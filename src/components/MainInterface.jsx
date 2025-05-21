import React, { useState } from 'react';
import { FaWhatsapp, FaMicrophone, FaStop, FaPaperPlane, FaRobot, FaMicrophoneAlt, FaRecordVinyl, FaStore } from 'react-icons/fa';
import LojaAgenteIA from './store/LojaAgenteIA';
import Chat from './Chat/Chat';
import logo from '../assets/logo.png';
import '../styles/store.css';

const MainInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implementar lógica de envio
      setMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', icon: <FaRobot />, label: 'Chat' },
    { id: 'audio', icon: <FaMicrophoneAlt />, label: 'Áudio' },
    { id: 'daw', icon: <FaRecordVinyl />, label: 'DAW' },
    { id: 'store', icon: <FaPaperPlane />, label: 'Loja' }
  ];
  const [dawContent, setDawContent] = useState(''); // Estado para sincronizar com o DAW

  const handleDawContentChange = (content) => {
    setDawContent(content);
  };

  return (
    <div className="main-container">
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`} style={{
              backgroundColor: activeTab === tab.id ? '#4F46E5' : '#1E293B',
              color: activeTab === tab.id ? '#FFFFFF' : '#E2E8F0',
              transition: 'background-color 0.2s'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container">
          <Chat />
        </div>
      )}

      {activeTab === 'daw' && (
        <div className="daw-container">
          <DAW onContentChange={handleDawContentChange} />
        </div>
      )}

      {activeTab === 'store' && (
        <div className="store-container">
          <LojaAgenteIA />
        </div>
      )}

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="message-input" style={{
              backgroundColor: '#334155',
              borderColor: '#334155',
              color: '#FFFFFF',
              placeholderColor: '#E2E8F0',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="input-buttons">
            <button
              className="icon-button" style={{
                backgroundColor: isRecording ? '#EF4444' : '#4F46E5',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onClick={toggleRecording}
              disabled={false}
            >
              {isRecording ? <FaStop /> : <FaMicrophoneAlt />}
            </button>
            <button
              className="icon-button send-button" style={{
                backgroundColor: message.trim() ? '#3B82F6' : '#334155',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInterface;