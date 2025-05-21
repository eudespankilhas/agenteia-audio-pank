import React, { useState } from 'react';
import axios from 'axios';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [response, setResponse] = useState('');

  const handleTabClick = async (theme) => {
    setActiveTab(theme);
    setResponse('Carregando resposta...');

    try {
      // Envia a solicitação para a IA
      const res = await axios.post('/api/ask', { theme });
      setResponse(res.data.answer);
    } catch (error) {
      setResponse('Erro ao obter resposta da IA.');
    }
  };

  return (
    <div>
      <div className="tabs">
        <button onClick={() => handleTabClick('cinema')}>Faça sua pergunta sobre Cinema</button>
        <button onClick={() => handleTabClick('ia_vertical')}>Gostaria de falar sobre IA Vertical</button>
        <button onClick={() => handleTabClick('futebol')}>Saber sobre Futebol</button>
      </div>
      <div className="response">
        {activeTab && <h3>Resposta sobre {activeTab}:</h3>}
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Tabs;