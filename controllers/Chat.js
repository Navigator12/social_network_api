const ChatService = require('../services/Chat')

const ChatController = {
  create: async (req, res) => {
    try {
      const { userId } = req.user

      const { otherId } = req.body

      const chat = await ChatService.create({ from: userId, to: otherId })

      return res.status(201).json({ chat })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  find: async (req, res) => {
    try {
      const { userId } = req.user

      const { otherId } = req.params

      const chat = await ChatService.find({ userId, otherId })

      return res.status(200).json({ chat })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  getUserChats: async (req, res) => {
    try {
      const { userId } = req.user

      const chats = await ChatService.getUserChats(userId)

      return res.status(200).json({ chats })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  write: async (req, res) => {
    try {
      const { userId } = req.user

      const { chatId, text } = req.body

      await ChatService.write({ userId, chatId, text })

      return res.status(201).json({})
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  getChatWithMessages: async (req, res) => {
    try {
      const { userId } = req.user

      const { otherId } = req.params

      const chat = await ChatService.getChatWithMessages({ userId, otherId })

      if (!chat) return res.status(404).json({})

      return res.status(200).json({ chat })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = ChatController
