const app = require("./app")

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`🌹 Servidor RoseDesk rodando na porta ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
})
