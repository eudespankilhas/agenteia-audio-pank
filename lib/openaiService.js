import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

export const generateContent = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em criação de conteúdo para áudio, capaz de gerar roteiros e sugestões para gravações de áudio."
        },
        {
          role: "user",
          content: `Baseado no seguinte briefing: ${prompt}, sugira um conteúdo apropriado para gravação de áudio. O conteúdo deve ser estruturado e adequado para narração.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    throw error;
  }
};

export const generateAudio = async (text, voice, language) => {
  try {
    // Aqui você implementará a lógica para gerar o áudio usando o serviço de TTS
    // Por enquanto, retornando um objeto simulado
    return {
      audioUrl: 'https://example.com/audio.mp3',
      duration: '02:30'
    };
  } catch (error) {
    console.error('Erro ao gerar áudio:', error);
    throw error;
  }
};

export const mixAudio = async (voiceUrl, trackUrl) => {
  try {
    // Aqui você implementará a lógica para mixar os áudios
    // Por enquanto, retornando um objeto simulado
    return {
      mixedAudioUrl: 'https://example.com/mixed-audio.mp3',
      duration: '02:30'
    };
  } catch (error) {
    console.error('Erro ao mixar áudio:', error);
    throw error;
  }
};
