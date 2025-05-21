import axios from 'axios';

const elevenLabsApi = axios.create({
  baseURL: 'https://api.elevenlabs.io/v1',
  headers: {
    'xi-api-key': process.env.VITE_ELEVENLABS_API_KEY,
    'accept': 'audio/mpeg',
    'Content-Type': 'application/json'
  }
});

// Lista de vozes disponíveis (definir conforme a documentação da ElevenLabs)
export const voices = {
  'pt': [
    { id: 'luciano', name: 'Luciano', gender: 'male', language: 'pt' },
    { id: 'maria', name: 'Maria', gender: 'female', language: 'pt' },
    { id: 'joao', name: 'João', gender: 'male', language: 'pt' },
    { id: 'ana', name: 'Ana', gender: 'female', language: 'pt' }
  ],
  'en': [
    { id: 'adam', name: 'Adam', gender: 'male', language: 'en' },
    { id: 'samantha', name: 'Samantha', gender: 'female', language: 'en' },
    { id: 'mike', name: 'Mike', gender: 'male', language: 'en' },
    { id: 'sarah', name: 'Sarah', gender: 'female', language: 'en' }
  ],
  'es': [
    { id: 'jose', name: 'José', gender: 'male', language: 'es' },
    { id: 'isabel', name: 'Isabel', gender: 'female', language: 'es' },
    { id: 'manuel', name: 'Manuel', gender: 'male', language: 'es' },
    { id: 'carmen', name: 'Carmen', gender: 'female', language: 'es' }
  ]
};

export const getVoices = async (language) => {
  try {
    const response = await elevenLabsApi.get('/voices');
    return response.data.voices.filter(voice => voice.name.startsWith(language));
  } catch (error) {
    console.error('Erro ao buscar vozes:', error);
    throw error;
  }
};

export const generateSpeech = async (text, voiceId, language) => {
  try {
    const response = await elevenLabsApi.post(
      `/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        responseType: 'arraybuffer'
      }
    );

    // Convertendo o arraybuffer para Blob
    const blob = new Blob([response.data], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Erro ao gerar áudio:', error);
    throw error;
  }
};
