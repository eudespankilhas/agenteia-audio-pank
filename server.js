import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
let openai;

dotenv.config();

const app = express();

// Configuração do CORS mais permissiva
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const apiKey = process.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_OPENAI_API_KEY não configurada');
}
openai = new OpenAI({ apiKey });

app.post('/api/ask', async (req, res) => {
  console.log('Recebida requisição para /api/ask');
  console.log('Corpo da requisição:', req.body);
  
  const { theme } = req.body;

  let prompt = '';
  if (theme === 'cinema') {
    prompt = theme.startsWith('en_') ? 'Talk about the greatest movies of all time.' : 'Fale sobre os melhores filmes de todos os tempos.';
  } else if (theme === 'ia_vertical') {
    prompt = theme.startsWith('en_') ? 'Explain the concept of Vertical AI and its applications.' : 'Explique o conceito de IA Vertical e suas aplicações.';
  } else if (theme === 'futebol') {
    prompt = theme.startsWith('en_') ? 'Who are the best soccer players in history?' : 'Quais são os melhores jogadores de futebol da história?';
  }

  try {
    console.log('API Key:', process.env.VITE_OPENAI_API_KEY ? 'Definida' : 'Não definida');
    
    if (!process.env.VITE_OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API Key da OpenAI não configurada' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    res.json({ answer: response.data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao se conectar à IA.' });
  }
});

const port = process.env.PORT || 5177;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});