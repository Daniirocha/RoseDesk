const express = require("express")
const router = express.Router()
const usersController = require("../controllers/users.controller")

// Rota de login
router.post("/login", usersController.login)

// Rotas de usuários
router.get("/", usersController.getAllUsers)
router.get("/:id", usersController.getUserById)

module.exports = router
