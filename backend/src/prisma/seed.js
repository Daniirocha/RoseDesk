const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.comment.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários DEMO
  const admin = await prisma.user.create({
    data: {
      nome: "Administrador",
      email: "admin@rosedesk.com",
      senha: "admin123", // Senha em texto simples para demo
      role: "ADMIN",
    },
  })

  const user = await prisma.user.create({
    data: {
      nome: "Usuário Comum",
      email: "user@rosedesk.com",
      senha: "user123", // Senha em texto simples para demo
      role: "USER",
    },
  })

  console.log("✅ Usuários criados:", { admin: admin.email, user: user.email })

  // Criar tickets de exemplo
  const ticket1 = await prisma.ticket.create({
    data: {
      titulo: "Problema com impressora",
      descricao: "A impressora do 3º andar não está funcionando",
      prioridade: "Alta",
      status: "Aberto",
      userId: user.id,
    },
  })

  const ticket2 = await prisma.ticket.create({
    data: {
      titulo: "Solicitação de novo software",
      descricao: "Preciso do Adobe Photoshop instalado no meu computador",
      prioridade: "Média",
      status: "Em Andamento",
      userId: user.id,
    },
  })

  const ticket3 = await prisma.ticket.create({
    data: {
      titulo: "Dúvida sobre VPN",
      descricao: "Como configurar a VPN para trabalho remoto?",
      prioridade: "Baixa",
      status: "Aberto",
      userId: user.id,
    },
  })

  console.log("✅ Tickets criados:", ticket1.id, ticket2.id, ticket3.id)

  // Criar comentários de exemplo
  await prisma.comment.create({
    data: {
      conteudo: "Estamos verificando o problema. Obrigado por reportar!",
      ticketId: ticket1.id,
      userId: admin.id,
    },
  })

  await prisma.comment.create({
    data: {
      conteudo: "O software foi solicitado ao departamento de TI.",
      ticketId: ticket2.id,
      userId: admin.id,
    },
  })

  console.log("✅ Comentários criados")
  console.log("🎉 Seed concluído com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
