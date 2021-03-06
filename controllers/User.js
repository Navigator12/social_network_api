const UserService = require('../services/User')

const UserController = {
  index: async (req, res) => {
    try {
      const { limit, offset } = req.query

      const users = await UserService.getAllUsers({
        limit: Number.parseInt(limit, 10),
        offset: Number.parseInt(offset, 10),
      })

      return res.status(200).json({
        users,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  me: async (req, res) => {
    try {
      const { userId } = req.user

      const user = await UserService.getUserById(userId)

      return res.status(200).json({
        user,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params

      const user = await UserService.getUserByIdWithPosts(id)

      if (!user) {
        return res.status(404).json({
          message: 'User does not exist',
        })
      }

      return res.status(200).json({
        user,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  friends: async (req, res) => {
    try {
      const { id } = req.params

      const friends = await UserService.getFriends(id)

      return res.status(200).json({
        friends,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  friendStatus: async (req, res) => {
    try {
      const { from, to } = req.params

      const status = await UserService.getFriendStatus({ from, to })

      return res.status(200).json({
        status,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  removeFriendRelation: async (req, res) => {
    try {
      const { userId } = req.user
      const { otherUserId } = req.params

      await UserService.removeFriendRelation({
        user1: userId,
        user2: otherUserId,
      })

      return res.status(204).json({})
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  register: async (req, res) => {
    try {
      await UserService.create(req.body)

      return res.status(201).json({
        message: 'User successfully registered',
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
