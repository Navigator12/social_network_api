const FriendRequestService = require('../services/FriendRequest')

const FriendRequestController = {
  send: async (req, res) => {
    try {
      const from = req.user.userId
      const { to } = req.body

      await FriendRequestService.send({ from, to })

      return res.status(201).json({
        message: 'Request sent successfully',
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

      const pendingRequests = await FriendRequestService.pending(userId)

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

      const sentRequests = await FriendRequestService.sent(userId)

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
