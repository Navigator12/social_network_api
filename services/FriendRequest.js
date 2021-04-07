const User = require('../models/User')
const FriendRequest = require('../models/FriendRequest')
const FriendRelation = require('../models/FriendRelation')

const FriendRequestService = {
  send: async (payload) => {
    const { from, to } = payload

    const users = await User.find({
      _id: {
        $in: [from, to],
      },
    })

    if (users.length !== 2) {
      throw new Error('User does not exist')
    }

    const request = new FriendRequest({
      from,
      to,
    })

    await request.save()
  },

  resolve: async (payload) => {
    const { requestId, userId, accept } = payload

    const request = await FriendRequest.findOneAndDelete({
      _id: requestId,
      to: userId,
    })

    if (request && accept) {
      const relation1 = new FriendRelation({
        from: request.from,
        to: request.to,
      })

      const relation2 = new FriendRelation({
        from: request.to,
        to: request.from,
      })

      await relation1.save()
      await relation2.save()
    }

    return request
  },

  pending: async (payload) => {
    const userId = payload

    const format = {
      to: 0,
      __v: 0,
    }

    const pendingRequests = await FriendRequest.find({
      to: userId,
    }, format)

    return pendingRequests
  },

  sent: async (payload) => {
    const userId = payload

    const format = {
      from: 0,
      __v: 0,
    }

    const sentRequests = await FriendRequest.find({
      from: userId,
    }, format)

    return sentRequests
  },
}

module.exports = FriendRequestService
