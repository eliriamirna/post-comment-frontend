# Post and Comments - Frontend

Este projeto é uma aplicação **Fullstack** de cadastro e gerenciamento de postagens, desenvolvida utilizando **React**, **Tailwind CSS**, **TypeScript**, e outras tecnologias modernas para garantir uma experiência de usuário interativa e fluida.

### Stack Utilizada

- **React**: Framework JavaScript para construção de interfaces de usuário. Escolhemos o React por sua flexibilidade e vasta comunidade, além de sua compatibilidade com o TypeScript, proporcionando uma excelente experiência de desenvolvimento.
- **Tailwind CSS**: Utilizado para estilização, o Tailwind CSS permite a construção rápida de interfaces responsivas e personalizadas de forma declarativa.
- **TypeScript**: Utilizado para garantir a tipagem estática e melhorar a manutenção e escalabilidade do código.
- **JWT (JSON Web Token)**: Para a autenticação do usuário. O JWT é utilizado para garantir que as rotas protegidas do sistema só possam ser acessadas por usuários autenticados.

## Funcionalidades

- **Cadastro e Autenticação de Usuários**: A aplicação permite que os usuários se cadastrem e façam login, utilizando a autenticação JWT para manter a sessão ativa durante a navegação.

- **CRUD de Postagens**: O sistema permite que os usuários criem, editem e excluam suas postagens. Apenas o usuário que criou a postagem pode editá-la ou excluí-la. Além disso, as postagens possuem funcionalidades adicionais como:
  - Adicionar uma imagem à postagem.

- **CRUD de Comentários**: Os usuários podem criar, editar e excluir seus próprios comentários em postagens. O proprietário da postagem também tem permissão para excluir os comentários.

- **Relatórios**: A aplicação gera relatórios das postagens, incluindo informações como:
  - Título da postagem.
  - Quantidade de comentários.

### Como Rodar o Sistema Localmente

1. **Pré-requisitos**:
   - Node.js (v14 ou superior)
   - NPM ou Yarn
   - Acesso à API Backend (verifique as instruções do backend no repositório correspondente)

## Como Executar o Projeto

1. Clone o repositório:

```bash
    git clone https://github.com/eliriamirna/post-comment-frontend
    cd post-comment-frontend
```

2. Instale as dependências:

```bash
    npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
    npm start
```

4. Acesse a aplicação no navegador:

- http://localhost:3000

# Estrutura do Projeto

```
├── public
│   └── index.html                  # Página HTML principal
├── src
│   ├── components                  # Componentes reutilizáveis
│   ├── pages
│   ├── utils                       # Utilitários e serviços
│   │   ├── api.ts                  # Arquivo de configuração da API
│   │   ├── config.ts               # Config URL
│   ├── App.tsx                     # Componente principal da aplicação
│   ├── index.tsx                   # Arquivo de entrada
│   └── index.css                   # Arquivo de estilos globais
├── package.json                    # Configurações e dependências do projeto
├── tailwind.config.js              # Configuração do Tailwind CSS
└── tsconfig.json                   # Configuração do TypeScript
```
