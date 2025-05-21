import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export const sendTextMessage = async (message, context = []) => {
  try {
    // Limitar o contexto para evitar timeout
    const limitedContext = context.slice(-5);
    
    const messages = [
      ...limitedContext,
      { role: 'user', content: message }
    ];

    const completion = await anthropic.messages.create({
      model: 'claude-2',
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Sua chave da API do Anthropic está inválida ou expirou. Por favor, gere uma nova chave em https://console.anthropic.com/account/api-keys');
    } else if (error.message.includes('429')) {
      throw new Error('Limite de uso atingido. Você atingiu o limite diário de uso da API do Anthropic. Tente novamente amanhã ou considere atualizar para um plano pago.');
    } else {
      throw new Error('Erro ao processar mensagem de texto: ' + error.message);
    }
  }
};

export const sendAudioMessage = async (audioBlob, context = []) => {
  try {
    // Converter o Blob para File
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

    // Transcrever o áudio
    const transcription = await anthropic.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    // Limitar o contexto para evitar timeout
    const limitedContext = context.slice(-5);
    
    const messages = [
      ...limitedContext,
      { role: 'user', content: transcription.text }
    ];

    // Enviar a transcrição para o chat
    const completion = await anthropic.messages.create({
      messages,
      model: 'claude-2',
      temperature: 0.7,
      max_tokens: 150,
    });

    return {
      transcription: transcription.text,
      response: completion.choices[0].message.content
    };
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Sua chave da API do Anthropic está inválida ou expirou. Por favor, gere uma nova chave em https://console.anthropic.com/account/api-keys');
    } else if (error.message.includes('429')) {
      throw new Error('Limite de uso atingido. Você atingiu o limite diário de uso da API do Anthropic. Tente novamente amanhã ou considere atualizar para um plano pago.');
    } else {
      throw new Error('Erro ao processar mensagem de áudio: ' + error.message);
    }
  }
};
