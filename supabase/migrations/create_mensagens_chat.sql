-- Criação da tabela mensagens_chat
CREATE TABLE IF NOT EXISTS public.mensagens_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  resposta TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Adicione índices para melhorar a performance
  CONSTRAINT mensagens_chat_usuario_idx UNIQUE (id, usuario)
);

-- Permissões RLS (Row Level Security)
ALTER TABLE public.mensagens_chat ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções anônimas
CREATE POLICY "Permitir inserções anônimas" ON public.mensagens_chat
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura anônima
CREATE POLICY "Permitir leitura anônima" ON public.mensagens_chat
  FOR SELECT USING (true);
