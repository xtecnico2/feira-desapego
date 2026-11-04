# 🛋️ Feira do Desapego - Venda de Móveis e Eletrodomésticos

Um site moderno, elegante e responsivo desenvolvido especialmente para a **Feira do Desapego** em **Petrópolis - RJ (Centro)**, com foco na venda de móveis, eletrodomésticos e utilidades.

Projetado para ser **fácil de usar**, com **painel de administração protegido por senha**, suporte a **múltiplas fotos por item**, **botões de interesse integrados ao WhatsApp** e **100% compatível com hospedagens gratuitas** (Vercel, Netlify, Cloudflare Pages, etc.).

---

## ✨ Principais Características

- **Visual Elegante & Minimalista**: Paleta acolhedora inspirada em lojas de design de interiores, tipografia refinada e cards com acabamento premium.
- **Painel Administrativo Restrito**:
  - Acesso protegido por PIN/senha (padrão: `admin123`, alterável no painel).
  - Cadastro, edição e exclusão de itens.
  - Alteração instantânea de status: **Disponível**, **Reservado** ou **Vendido**.
- **Múltiplas Fotos com Otimização**:
  - Envie várias fotos por item direto do celular ou computador (ou cole URLs).
  - **Compressão automática no navegador**: fotos pesadas tiradas com celular são automaticamente otimizadas para carregamento ultrarrápido sem estourar limites de armazenamento.
  - Escolha qual foto será a capa com 1 clique.
  - Visualização em galeria com miniaturas e ampliação em tela cheia (lightbox).
- **Canal Direto de Interesse**:
  - **Botão direto de WhatsApp**: abre a conversa com o vendedor com mensagem já pronta contendo o nome e o preço do produto.
  - **Formulário de Interesse no Site**: o visitante pode deixar nome, telefone e dúvida.
  - **Caixa de Entrada de Interesses**: no painel administrativo, o vendedor vê todos os interessados com um botão para responder direto no WhatsApp.
- **Filtros e Busca Inteligente**:
  - Busca em tempo real por nome, descrição ou marca.
  - Filtro por categorias (*Móveis*, *Eletrodomésticos*, *Decoração*, etc.).
  - Filtro por status (*Apenas Disponíveis*, *Reservados*, *Vendidos*).
  - Ordenação por preço (menor/maior), mais recentes ou maior desconto.
- **Backup e Restauração em 1 Clique**:
  - Baixe um arquivo `.json` com todo o seu catálogo e fotos para guardar como backup ou transferir entre computadores.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
Ter o [Node.js](https://nodejs.org/) instalado (já disponível no seu sistema).

### 2. Iniciar o Servidor de Desenvolvimento
No terminal do projeto, execute:
```bash
npm run dev
```
Abra o navegador no endereço exibido (geralmente `http://localhost:5173`).

---

## 🔐 Como Acessar a Área de Administrador

1. No cabeçalho (ou no rodapé), clique em **Admin** (ícone de cadeado).
2. Digite o PIN de administrador padrão: `admin123`.
3. Pronto! O botão **"Painel Admin"** aparecerá no topo.
4. No painel você pode:
   - Cadastrar novos itens no botão **"+ Novo Item para Venda"**.
   - Mudar status de qualquer produto (*Disponível*, *Reservado*, *Vendido*).
   - Ver a lista de pessoas que registraram interesse.
   - Alterar nas configurações: o WhatsApp do vendedor, cidade/bairro e trocar a senha de administrador.

---

## 🌐 Como Publicar Grátis na Internet

O site gera arquivos estáticos puros (`dist/`), o que significa que você pode hospedá-lo **gratuitamente** em qualquer uma destas plataformas:

### Opção 1: Netlify Drop (Mais rápida - Sem precisar de terminal)
1. Execute no terminal:
   ```bash
   npm run build
   ```
2. Isso criará a pasta `dist`.
3. Acesse [app.netlify.com/drop](https://app.netlify.com/drop) (crie uma conta gratuita se não tiver).
4. Arraste e solte a pasta `dist` na página do Netlify.
5. Em segundos seu site estará no ar com link público HTTPS!

---

### Opção 2: Vercel (Recomendada via GitHub)
1. Crie um repositório no seu GitHub e suba este projeto.
2. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub.
3. Clique em **"Add New Project"** e selecione o repositório `VendaMoveis`.
4. Clique em **Deploy**. A Vercel detectará o Vite automaticamente e publicará o site.

---

## ☁️ Armazenamento em Nuvem com Supabase (100% Gratuito)

Por padrão, o site já funciona perfeitamente salvando no navegador. Se você quiser que o catálogo fique sincronizado na nuvem para editar pelo celular e pelo computador simultaneamente:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Crie um novo projeto (ex: `desapego-moveis`).
3. No menu lateral esquerdo, clique em **SQL Editor**.
4. Copie todo o conteúdo do arquivo `supabase-schema.sql` deste projeto, cole no editor do Supabase e clique em **RUN**.
5. Vá em **Project Settings** -> **API** e copie a **Project URL** e a **anon public key**.
6. Crie um arquivo `.env` na raiz do projeto (ou adicione as variáveis no painel da Vercel/Netlify):
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   ```
7. Pronto! O site detectará o Supabase automaticamente e salvará todos os produtos e mensagens de interessados na nuvem.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (Design moderno, responsivo e ultra leve)
- **Lucide Icons** (Ícones modernos e intuitivos)
- **Canvas Confetti** (Animação de feedback ao registrar interesse)
- **Supabase JS** (Suporte a banco de dados gratuito e opcional)
