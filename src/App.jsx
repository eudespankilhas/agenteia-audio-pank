import React from 'react'
import { ChakraProvider } from '@chakra-ui/react';
import MainInterface from './components/MainInterface';

function App() {
  return (
    <ChakraProvider>
      <div className="app-container" style={{
        backgroundColor: '#1E293B',
        color: '#FFFFFF'
      }}>
        <header className="header" style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <h1 className="text-2xl font-bold">AGENTE IA - ÁUDIO PANK</h1>
        </header>
        <MainInterface />
      </div>
    </ChakraProvider>
  );
}

export default App