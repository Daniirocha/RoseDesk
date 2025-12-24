const express = require("express")
const router = express.Router()
const ticketsController = require("../controllers/tickets.controller")

router.get("/stats", ticketsController.getStats)

// Rotas de tickets
router.get("/", ticketsController.getAllTickets)
router.get("/:id", ticketsController.getTicketById)
router.post("/", ticketsController.createTicket)
router.put("/:id", ticketsController.updateTicket)
router.delete("/:id", ticketsController.deleteTicket)

// Rota para adicionar comentário
router.post("/:id/comments", ticketsController.addComment)

module.exports = router
