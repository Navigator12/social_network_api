const User = require('../models/User')
const FriendRequest = require('../models/FriendRequest')
const FriendRelation = require('../models/FriendRelation')

const FriendRequestService = {
  send: async (payload) => {
    const { from, to } = payload

    const users = await User
      .find({
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

    await request
      .populate({
        path: 'to',
        select: '_id nickname',
      })
      .execPopulate()

    return {
      _id: request.to._id,
      nickname: request.to.nickname,
      requestId: request._id,
    }
  },

  resolve: async (payload) => {
    const { requestId, userId, accept } = payload

    const request = await FriendRequest
      .findOneAndDelete({
        _id: requestId,
        to: userId,
      })

    if (!request) {
      throw new Error('Friend request does not exist')
    }

    if (accept) {
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

    await request
      .populate({
        path: 'from',
        select: '_id nickname date',
      })
      .execPopulate()

    return {
      status: accept,
      friend: {
        _id: request.from._id,
        nickname: request.from.nickname,
        date: request.from.date,
      },
    }
  },

  cancel: async (payload) => {
    const { requestId, userId } = payload

    const request = await FriendRequest
      .findOneAndDelete({
        _id: requestId,
        from: userId,
      })

    if (!request) {
      throw new Error('Friend request does not exist')
    }
  },

  pending: async (payload) => {
    const { userId, limit, offset } = payload

    const pendingRequests = await FriendRequest
      .find({
        to: userId,
      }, '_id from')
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'from',
        select: '_id nickname date',
      })
      .lean()
      .map((requests) => requests.map((req) => ({
        _id: req.from._id,
        nickname: req.from.nickname,
        requestId: req._id,
      })))

    return pendingRequests
  },

  sent: async (payload) => {
    const { userId, limit, offset } = payload

    const sentRequests = await FriendRequest
      .find({
        from: userId,
      }, '_id to')
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'to',
        select: '_id nickname date',
      })
      .lean()
      .map((requests) => requests.map((req) => ({
        _id: req.to._id,
        nickname: req.to.nickname,
        requestId: req._id,
      })))

    return sentRequests
  },
}

module.exports = FriendRequestService
