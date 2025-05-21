import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.VITE_OPENAI_API_KEY,
  })
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { theme } = req.body;

  let prompt = '';
  if (theme === 'cinema') {
    prompt = 'Fale sobre os melhores filmes de todos os tempos.';
  } else if (theme === 'ia_vertical') {
    prompt = 'Explique o conceito de IA Vertical e suas aplicações.';
  } else if (theme === 'futebol') {
    prompt = 'Quais são os melhores jogadores de futebol da história?';
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });

    res.status(200).json({ answer: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao se conectar à IA.' });
  }
}