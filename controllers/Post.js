const PostService = require('../services/Post')

const PostController = {
  news: async (req, res) => {
    try {
      const { userId } = req.user
      const { limit, offset } = req.query

      const news = await PostService.news({
        userId,
        limit: Number.parseInt(limit, 10),
        offset: Number.parseInt(offset, 10),
      })

      return res.status(201).json({
        news,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  create: async (req, res) => {
    try {
      const { userId } = req.user
      const { text } = req.body

      const post = await PostService.create({ text, author: userId })

      return res.status(201).json({
        post,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  delete: async (req, res) => {
    try {
      const { userId } = req.user
      const { id } = req.params

      await PostService.delete({ userId, postId: id })

      return res.status(201).json({
        postId: id,
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

      const post = await PostService.comment({ postId, text, author: userId })

      return res.status(201).json({
        post,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = PostController
