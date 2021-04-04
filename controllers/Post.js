const PostService = require('../services/Post')

const PostController = {
  create: async (req, res) => {
    try {
      const { userId } = req.user
      const { text } = req.body

      await PostService.create({ text, author: userId })

      return res.status(201).json({
        message: 'Post successfully created',
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  comment: async (req, res) => {
    try {
      const { userId } = req.user
      const { postId, text } = req.body

      await PostService.comment({ postId, text, author: userId })

      return res.status(201).json({
        message: 'Post successfully commented',
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = PostController
