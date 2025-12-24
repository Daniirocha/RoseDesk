const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

function mapUserToAPI(user) {
  return {
    id: user.id,
    name: user.nome,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

// Serviço de login (sem JWT)
async function loginUser(email, senha) {
  // Buscar usuário por email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      nome: true,
      email: true,
      senha: true,
      role: true,
    },
  })

  // Verificar se usuário existe
  if (!user) {
    throw new Error("Credenciais inválidas")
  }

  // Verificar senha (comparação direta - sem hash para demo)
  if (user.senha !== senha) {
    throw new Error("Credenciais inválidas")
  }

  return {
    id: user.id,
    name: user.nome,
    email: user.email,
    role: user.role,
  }
}

// Buscar todos os usuários
async function findAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return users.map(mapUserToAPI)
}

// Buscar usuário por ID
async function findUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: Number.parseInt(id) },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  return mapUserToAPI(user)
}

module.exports = {
  loginUser,
  findAllUsers,
  findUserById,
}
