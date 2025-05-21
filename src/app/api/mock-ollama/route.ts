import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Simula um pequeno delay para parecer mais natural
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simula uma resposta de IA baseada no input
    const respostaSimulada = `Recebi sua pergunta: "${prompt}". Como assistente da Áudio Pank, estou aqui para ajudar! 🎵`;

    return NextResponse.json({ result: respostaSimulada });
  } catch (error) {
    console.error('Erro na rota mock-ollama:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}