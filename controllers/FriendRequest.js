const FriendRequestService = require('../services/FriendRequest')

const FriendRequestController = {
  send: async (req, res) => {
    try {
      const from = req.user.userId
      const { to } = req.body

      const request = await FriendRequestService.send({ from, to })

      return res.status(201).json({
        request,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  resolve: async (req, res) => {
    try {
      const { userId } = req.user
      const { requestId, accept } = req.body

      const { status, friend } = await FriendRequestService.resolve({ requestId, userId, accept })

      return res.status(201).json({
        status,
        friend,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  cancel: async (req, res) => {
    try {
      const { userId } = req.user
      const { requestId } = req.body

      await FriendRequestService.cancel({ requestId, userId })

      return res.status(201).json({
        requestId,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  pending: async (req, res) => {
    try {
      const userId = req.params.id
      const { limit, offset } = req.query

      const pendingRequests = await FriendRequestService.pending({
        userId,
        limit: Number.parseInt(limit, 10),
        offset: Number.parseInt(offset, 10),
      })

      return res.status(200).json({
        pendingRequests,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },

  sent: async (req, res) => {
    try {
      const userId = req.params.id
      const { limit, offset } = req.query

      const sentRequests = await FriendRequestService.sent({
        userId,
        limit: Number.parseInt(limit, 10),
        offset: Number.parseInt(offset, 10),
      })

      return res.status(200).json({
        sentRequests,
      })
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      })
    }
  },
}

module.exports = FriendRequestController
