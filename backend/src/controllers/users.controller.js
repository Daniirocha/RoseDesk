const usersService = require("../services/users.service")

// Login do usuário
async function login(req, res) {
  try {
    const { email, senha, password } = req.body
    const passwordToUse = password || senha

    if (!email || !passwordToUse) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      })
    }

    const user = await usersService.loginUser(email, passwordToUse)

    res.status(200).json({
      user: user,
    })
  } catch (erro) {
    res.status(401).json({ error: erro.message })
  }
}

// Buscar todos os usuários
async function getAllUsers(req, res) {
  try {
    const users = await usersService.findAllUsers()
    res.status(200).json(users)
  } catch (erro) {
    res.status(500).json({ error: erro.message })
  }
}

// Buscar usuário por ID
async function getUserById(req, res) {
  try {
    const { id } = req.params
    const user = await usersService.findUserById(id)
    res.status(200).json(user)
  } catch (erro) {
    res.status(404).json({ error: erro.message })
  }
}

module.exports = {
  login,
  getAllUsers,
  getUserById,
}
