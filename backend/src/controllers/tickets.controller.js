const ticketsService = require("../services/tickets.service")

// Buscar todos os tickets
async function getAllTickets(req, res) {
  try {
    const { userId, userRole } = req.query

    const data = await ticketsService.findAllTickets(userId ? Number.parseInt(userId) : null, userRole)

    res.status(200).json(data)
  } catch (erro) {
    res.status(500).json({ error: erro.message })
  }
}

async function getStats(req, res) {
  try {
    const { userId, userRole } = req.query

    const stats = await ticketsService.getStats(userId ? Number.parseInt(userId) : null, userRole)

    res.status(200).json(stats)
  } catch (erro) {
    res.status(500).json({ error: erro.message })
  }
}

// Buscar ticket por ID
async function getTicketById(req, res) {
  try {
    const { id } = req.params
    const { userId, userRole } = req.query

    const ticket = await ticketsService.findTicketById(id, userId ? Number.parseInt(userId) : null, userRole)

    res.status(200).json(ticket)
  } catch (erro) {
    const statusCode = erro.message.includes("permissão") ? 403 : 404
    res.status(statusCode).json({ error: erro.message })
  }
}

// Criar novo ticket
async function createTicket(req, res) {
  try {
    const ticket = await ticketsService.createNewTicket(req.body)
    res.status(201).json(ticket)
  } catch (erro) {
    res.status(400).json({ error: erro.message })
  }
}

// Atualizar ticket
async function updateTicket(req, res) {
  try {
    const { id } = req.params
    const { userId, userRole } = req.body

    const ticket = await ticketsService.updateExistingTicket(
      id,
      req.body,
      userId ? Number.parseInt(userId) : null,
      userRole,
    )

    res.status(200).json(ticket)
  } catch (erro) {
    const statusCode = erro.message.includes("permissão") ? 403 : 400
    res.status(statusCode).json({ error: erro.message })
  }
}

// Deletar ticket
async function deleteTicket(req, res) {
  try {
    const { id } = req.params
    const { userId, userRole } = req.query

    const result = await ticketsService.deleteTicketById(id, userId ? Number.parseInt(userId) : null, userRole)

    res.status(200).json(result)
  } catch (erro) {
    const statusCode = erro.message.includes("permissão") ? 403 : 404
    res.status(statusCode).json({ error: erro.message })
  }
}

// Adicionar comentário a um ticket
async function addComment(req, res) {
  try {
    const { id } = req.params
    const { content, userId } = req.body

    const comment = await ticketsService.addCommentToTicket(id, content, userId)

    res.status(201).json(comment)
  } catch (erro) {
    res.status(400).json({ error: erro.message })
  }
}

module.exports = {
  getAllTickets,
  getStats,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
}
