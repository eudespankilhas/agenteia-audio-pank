import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient({
  apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
});

export const sendTextMessage = async (message, context = []) => {
  try {
    // Limitar o contexto para evitar timeout
    const limitedContext = context.slice(-5);
    
    // Criar prompt com contexto
    const prompt = limitedContext
      .map(msg => `${msg.type === 'user' ? 'Usuário: ' : 'Assistente: '}${msg.content}\n`)
      .join('') + `Usuário: ${message}\nAssistente: `;

    const response = await client.textGeneration({
      model: 'meta-llama/Llama-2-7b-chat-hf',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      },
    });

    return response.generated_text;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Sua chave da API do Hugging Face está inválida ou expirou. Por favor, gere uma nova chave em https://huggingface.co/settings/tokens');
    } else if (error.message.includes('429')) {
      throw new Error('Limite de uso atingido. Você atingiu o limite diário de uso da API do Hugging Face. Tente novamente amanhã ou considere atualizar para um plano pago.');
    } else {
      throw new Error('Erro ao processar mensagem de texto: ' + error.message);
    }
  }
};

export const sendAudioMessage = async (audioBlob, context = []) => {
  try {
    // Converter o Blob para File
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

    // Transcrever o áudio usando Whisper
    const transcription = await client.audioToText({
      model: 'openai/whisper-large-v3',
      file: audioFile,
    });

    // Limitar o contexto para evitar timeout
    const limitedContext = context.slice(-5);
    
    // Criar prompt com contexto
    const prompt = limitedContext
      .map(msg => `${msg.type === 'user' ? 'Usuário: ' : 'Assistente: '}${msg.content}\n`)
      .join('') + `Usuário: ${transcription}\nAssistente: `;

    const response = await client.textGeneration({
      model: 'meta-llama/Llama-2-7b-chat-hf',
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      },
    });

    return {
      transcription,
      response: response.generated_text
    };
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Sua chave da API do Hugging Face está inválida ou expirou. Por favor, gere uma nova chave em https://huggingface.co/settings/tokens');
    } else if (error.message.includes('429')) {
      throw new Error('Limite de uso atingido. Você atingiu o limite diário de uso da API do Hugging Face. Tente novamente amanhã ou considere atualizar para um plano pago.');
    } else {
      throw new Error('Erro ao processar mensagem de áudio: ' + error.message);
    }
  }
};
