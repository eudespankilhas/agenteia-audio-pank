import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, PhoneCall, MessageCircle } from "lucide-react";
import { ollamaService } from '../services/ollama';

export default function AudioPankAI() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Olá! Eu sou a Áudio Pank AI. Em que posso te ajudar hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [whatsInput, setWhatsInput] = useState("");
  const [showWhatsForm, setShowWhatsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await ollamaService.sendMessage(input, messages.map(msg => ({
        type: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      })));

      const aiMessage = { from: "ai", text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = { from: "ai", text: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsMessage = () => {
    const lastMessage = messages.filter(m => m.from === "ai").slice(-1)[0]?.text || "";
    const msg = encodeURIComponent(`${lastMessage}\n\n(Enviado via Áudio Pank AI)`);
    const phone = whatsInput.replace(/\D/g, "");
    if (phone.length >= 10) {
      const url = `https://wa.me/55${phone}?text=${msg}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/logo-audio-pank.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold text-purple-400">Áudio Pank AI</h1>
        </div>

        <Card className="bg-zinc-900 text-white">
          <CardContent className="p-4 h-[400px] overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.from === 'ai' ? 'text-purple-300' : 'text-white'}`}>
                {msg.text}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            variant="secondary" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            <Send size={18} />
          </Button>
          <Button onClick={() => setShowWhatsForm(!showWhatsForm)} variant="ghost">
            <MessageCircle size={18} className="text-green-400" />
          </Button>
        </div>

        {showWhatsForm && (
          <div className="mt-4 p-2 border border-zinc-700 rounded">
            <label className="text-sm">Digite seu número de WhatsApp:</label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Ex: 85991234567"
                className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                value={whatsInput}
                onChange={e => setWhatsInput(e.target.value)}
              />
              <Button onClick={sendWhatsMessage} className="bg-green-600 hover:bg-green-700">
                <PhoneCall size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}