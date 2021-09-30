const ChatService = require('../services/Chat')

const ChatController = {
  create: async (req, res) => {
    try {
      const { userId } = req.user

      const { otherId } = req.body

      await ChatService.create({ from: userId, to: otherId })

      return res.status(201).json({})
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

      if (!chat) return res.status(404).json({})

      return res.status(200).json({ chat })
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

  getMessages: async (req, res) => {
    try {
      const { userId } = req.user

      const { chatId } = req.params

      const chat = await ChatService.getChatWithMessages({ userId, chatId })

      if (!chat) return res.status(404).json({})

      return res.status(200).json({ messages: chat.messages })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = ChatController
