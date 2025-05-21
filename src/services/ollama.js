import axios from 'axios';

const API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'https://agenteiaaudiopank.vercel.app/api';

export const ollamaService = {
    async sendMessage(message, history = []) {
        try {
            const prompt = history.length > 0 
                ? history.map(msg => `${msg.type === 'user' ? 'Usuário: ' : 'Assistente: '}${msg.content}\n`).join('') + 'Usuário: ' + message
                : message;

            const response = await axios.post(`${API_URL}/generate`, {
                model: 'llama2',
                prompt: prompt,
                stream: false,
                system: 'Você é um assistente útil e amigável. Analise cuidadosamente o idioma da pergunta do usuário. Se a pergunta for em português, responda em português de forma clara e natural. Se a pergunta for em inglês, responda em inglês. Mantenha sempre um tom profissional e amigável, adequando o idioma da resposta ao idioma da pergunta do usuário.',
                temperature: 0.7,
                max_tokens: 1000
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            return response.data.response;
        } catch (error) {
            console.error('Erro ao enviar mensagem para o Ollama:', error);
            throw new Error('Erro ao processar mensagem. Por favor, tente novamente.');
        }
    },

    async getModels() {
        try {
            const response = await axios.get(`${API_URL}/tags`);
            return response.data.models;
        } catch (error) {
            console.error('Erro ao listar modelos:', error);
            throw error;
        }
    },
};
