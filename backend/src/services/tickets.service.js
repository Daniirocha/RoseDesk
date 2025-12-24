const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

function mapTicketToAPI(ticket) {
  return {
    id: ticket.id,
    title: ticket.titulo,
    description: ticket.descricao,
    priority: ticket.prioridade,
    status: ticket.status,
    userId: ticket.userId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    user: ticket.user
      ? {
          id: ticket.user.id,
          name: ticket.user.nome,
          email: ticket.user.email,
          role: ticket.user.role,
        }
      : undefined,
    comments: ticket.comments
      ? ticket.comments.map((c) => ({
          id: c.id,
          content: c.conteudo,
          ticketId: c.ticketId,
          userId: c.userId,
          createdAt: c.createdAt,
          user: c.user
            ? {
                id: c.user.id,
                name: c.user.nome,
                email: c.user.email,
              }
            : undefined,
        }))
      : undefined,
  }
}

// Buscar todos os tickets (com filtro por usuário se necessário)
async function findAllTickets(userId = null, userRole = null) {
  const where = {}

  // Se for USER, só pode ver seus próprios tickets
  if (userRole === "USER" && userId) {
    where.userId = userId
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return {
    tickets: tickets.map(mapTicketToAPI),
    total: tickets.length,
  }
}

// Buscar ticket por ID (com validação de permissão)
async function findTicketById(id, userId = null, userRole = null) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number.parseInt(id) },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) {
    throw new Error("Ticket não encontrado")
  }

  // Verificar permissão: USER só pode ver seus próprios tickets
  if (userRole === "USER" && ticket.userId !== userId) {
    throw new Error("Você não tem permissão para visualizar este ticket")
  }

  return mapTicketToAPI(ticket)
}

function mapPriorityToDB(priority) {
  const map = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Alta", // Urgente também mapeia para Alta
  }
  return map[priority] || priority
}

function mapStatusToDB(status) {
  const map = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em Andamento",
    CLOSED: "Fechado",
  }
  return map[status] || status
}

// Criar novo ticket
async function createNewTicket(data) {
  const { title, description, priority, userId } = data

  // Validações
  if (!title || !description || !priority || !userId) {
    throw new Error("Todos os campos são obrigatórios")
  }

  const prioridadeDB = mapPriorityToDB(priority)

  const ticket = await prisma.ticket.create({
    data: {
      titulo: title,
      descricao: description,
      prioridade: prioridadeDB,
      status: "Aberto",
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return mapTicketToAPI(ticket)
}

// Atualizar ticket
async function updateExistingTicket(id, data, userId = null, userRole = null) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number.parseInt(id) },
    include: {
      comments: true,
    },
  })

  if (!ticket) {
    throw new Error("Ticket não encontrado")
  }

  // Apenas ADMIN pode atualizar tickets
  if (userRole !== "ADMIN") {
    throw new Error("Você não tem permissão para atualizar tickets")
  }

  if (data.status === "CLOSED" && ticket.comments.length === 0) {
    throw new Error("Não é possível fechar um ticket sem comentários")
  }

  const updateData = {}
  if (data.status) updateData.status = mapStatusToDB(data.status)
  if (data.priority) updateData.prioridade = mapPriorityToDB(data.priority)
  if (data.title) updateData.titulo = data.title
  if (data.description) updateData.descricao = data.description

  const updatedTicket = await prisma.ticket.update({
    where: { id: Number.parseInt(id) },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  return mapTicketToAPI(updatedTicket)
}

// Deletar ticket
async function deleteTicketById(id, userId = null, userRole = null) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number.parseInt(id) },
  })

  if (!ticket) {
    throw new Error("Ticket não encontrado")
  }

  // Apenas ADMIN pode deletar tickets
  if (userRole !== "ADMIN") {
    throw new Error("Você não tem permissão para deletar tickets")
  }

  await prisma.ticket.delete({
    where: { id: Number.parseInt(id) },
  })

  return { message: "Ticket deletado com sucesso" }
}

// Adicionar comentário a um ticket
async function addCommentToTicket(ticketId, content, userId) {
  // Validações
  if (!content) {
    throw new Error("O conteúdo do comentário é obrigatório")
  }

  // Verificar se ticket existe
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number.parseInt(ticketId) },
  })

  if (!ticket) {
    throw new Error("Ticket não encontrado")
  }

  const comment = await prisma.comment.create({
    data: {
      conteudo: content,
      ticketId: Number.parseInt(ticketId),
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    },
  })

  return {
    id: comment.id,
    content: comment.conteudo,
    ticketId: comment.ticketId,
    userId: comment.userId,
    createdAt: comment.createdAt,
    user: {
      id: comment.user.id,
      name: comment.user.nome,
      email: comment.user.email,
    },
  }
}

async function getStats(userId = null, userRole = null) {
  const where = {}

  // Se for USER, só conta seus próprios tickets
  if (userRole === "USER" && userId) {
    where.userId = userId
  }

  const [totalTickets, openTickets, inProgressTickets, closedTickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.count({ where: { ...where, status: "Aberto" } }),
    prisma.ticket.count({ where: { ...where, status: "Em Andamento" } }),
    prisma.ticket.count({ where: { ...where, status: "Fechado" } }),
  ])

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    closedTickets,
    myTickets: userRole === "USER" ? totalTickets : 0,
    avgResponseTime: "2h 30min", // Mock - pode ser implementado depois
  }
}

module.exports = {
  findAllTickets,
  findTicketById,
  createNewTicket,
  updateExistingTicket,
  deleteTicketById,
  addCommentToTicket,
  getStats,
}
