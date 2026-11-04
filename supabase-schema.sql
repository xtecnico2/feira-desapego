-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS SUPABASE (100% GRATUITO)
-- ==============================================================================
-- Instruções:
-- 1. Crie uma conta gratuita em https://supabase.com
-- 2. Crie um novo projeto (ex: "venda-moveis")
-- 3. Vá no menu "SQL Editor" na barra lateral esquerda
-- 4. Cole este script completo e clique em "RUN"
-- 5. Copie a URL do projeto e a ANON KEY pública em "Project Settings" -> "API"
-- 6. Adicione no seu arquivo .env ou nas variáveis da Vercel/Netlify:
--    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
--    VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
-- ==============================================================================

-- 1. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    condition TEXT,
    dimensions TEXT,
    voltage TEXT,
    brand TEXT,
    description TEXT,
    pickup_location TEXT,
    status TEXT DEFAULT 'disponivel', -- 'disponivel', 'reservado', 'vendido'
    featured BOOLEAN DEFAULT false,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE INTERESSES DOS COMPRADORES
CREATE TABLE IF NOT EXISTS public.interests (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_title TEXT NOT NULL,
    product_price NUMERIC,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'novo', -- 'novo', 'contatado', 'finalizado'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO (Permitir leitura pública e escrita para os formulários)
-- Leitura pública dos produtos
CREATE POLICY "Produtos são visíveis publicamente"
ON public.products FOR SELECT
USING (true);

-- Permitir inserção, alteração e deleção pública (ou via chave anon do app)
CREATE POLICY "Gerenciamento de produtos"
ON public.products FOR ALL
USING (true)
WITH CHECK (true);

-- Leitura pública de interesses (acesso admin no app)
CREATE POLICY "Interesses visíveis"
ON public.interests FOR SELECT
USING (true);

-- Visitantes podem registrar interesse
CREATE POLICY "Visitantes podem registrar interesse"
ON public.interests FOR INSERT
WITH CHECK (true);

-- Atualização e deleção de interesses
CREATE POLICY "Gerenciamento de interesses"
ON public.interests FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- PRONTO! Seu banco está configurado.
-- ==============================================================================
