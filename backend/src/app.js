const express = require("express")
const cors = require("cors")
require("dotenv").config()

const usersRoutes = require("./routes/users.routes")
const ticketsRoutes = require("./routes/tickets.routes")

const app = express()

// Middlewares globais
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Rota de health check
app.get("/", (req, res) => {
  res.json({
    mensagem: "API RoseDesk está rodando! 🌹",
    versao: "1.0.0",
  })
})

// Rotas da API
app.use("/api/users", usersRoutes)
app.use("/api/tickets", ticketsRoutes)

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" })
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro:", err)
  res.status(500).json({
    erro: "Erro interno do servidor",
    detalhes: err.message,
  })
})

module.exports = app
