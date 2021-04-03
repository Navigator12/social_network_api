const UserService = require('../services/User')

const UserController = {
  register: async (req, res) => {
    try {
      await UserService.create(req.body)

      return res.status(201).json({
        message: 'Successfully registered',
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  login: async (req, res) => {
    try {
      const token = await UserService.login(req.body)

      return res.status(200).json({
        token,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = UserController
