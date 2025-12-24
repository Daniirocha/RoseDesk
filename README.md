cat << 'EOF' > README.md
# 🌹 RoseDesk

RoseDesk é uma aplicação web fullstack de Help Desk / Gestão de Tickets, desenvolvida para portfólio profissional, com foco em clareza de código, regras de negócio reais e experiência de uso.

O sistema permite que usuários abram chamados de suporte, acompanhem o status e adicionem comentários, enquanto administradores podem visualizar todos os tickets do sistema.

---

## ✨ Funcionalidades

### 👥 Autenticação (Demo)
- Login simples via API REST  
- Usuários DEMO já cadastrados  
- Controle de acesso por perfil (ADMIN / USER)  
- Sem JWT, focado em simplicidade para portfólio  

### 🎫 Tickets
- Criar tickets com:
  - Título
  - Descrição
  - Prioridade (Baixa, Média, Alta)
- Listar tickets  
- Visualizar detalhes  
- Editar e excluir tickets  

**Status disponíveis:**
- Aberto  
- Em Andamento  
- Fechado  

### 💬 Comentários
- Adicionar comentários aos tickets  
- Exibição de autor e data  
- Regra: não é possível fechar um ticket sem comentários  

### 🔐 Regras de Negócio
- Usuário comum (USER) só pode visualizar e gerenciar seus próprios tickets  
- Administrador (ADMIN) pode visualizar todos os tickets  
- Prioridade é obrigatória ao criar um ticket  
- Validações feitas no backend  
- Banco de dados local com SQLite  

---

## 🧪 Usuários DEMO

| Perfil | Email              | Senha     |
|--------|--------------------|-----------|
| ADMIN  | admin@rosedesk.com | admin123  |
| USER   | user@rosedesk.com  | user123   |

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React / Next.js  
- TypeScript  
- Tailwind CSS  
- Vite (ambiente de desenvolvimento)  
- Design responsivo  
- Paleta rosa moderna e corporativa  

### Backend
- Node.js  
- Express  
- Prisma ORM  
- SQLite  
- API REST  

---

## 📁 Estrutura do Projeto
```
/
├── frontend/        # Interface web (React / Next.js)
├── backend/         # API REST (Node + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── prisma/
│   │   └── app.js
│   └── server.js
└── README.md
```

---

## 🚀 Como rodar o projeto localmente

### ✅ Pré-requisitos
- Node.js (v16 ou superior)  
- npm ou yarn  

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/rosedesk.git
cd rosedesk
```

### 2️⃣ Backend
```bash
cd backend
npm install

# Criar o banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Iniciar o servidor
npm run dev
```
➡ Backend rodando em: [http://localhost:3001](http://localhost:3001)

### 3️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```
➡ Frontend rodando em: [http://localhost:5173](http://localhost:5173)

---

## 📡 Principais Endpoints da API

### Login
```
POST /api/users/login
```
**Body:**
```json
{
  "email": "admin@rosedesk.com",
  "senha": "admin123"
}
```

### Tickets
```
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
DELETE /api/tickets/:id
POST   /api/tickets/:id/comments
```

---

## 🎯 Objetivo do Projeto
Este projeto foi desenvolvido com foco em:
- Portfólio profissional  
- Boas práticas de organização de código  
- Regras de negócio realistas  
- Simplicidade e clareza  

> Observação: A autenticação foi propositalmente simplificada (login demo) para facilitar testes e avaliação do projeto.

---

## 👩‍💻 Autora
**Danielle Rocha**  
Desenvolvedora Full Stack
EOF