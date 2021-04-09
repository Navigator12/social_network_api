const bcrypt = require('bcrypt')

const User = require('../models/User')
const FriendRelation = require('../models/FriendRelation')
const { getToken } = require('../utils/Token')

const UserService = {
  getAllUsers: async (payload) => {
    const { limit, offset } = payload

    const users = await User
      .find({}, '_id nickname date')
      .skip(offset)
      .limit(limit)

    return users
  },

  getUserById: async (payload) => {
    const id = payload

    const user = await User
      .findById(id, '_id nickname date')

    return user
  },

  getUserByIdWithPosts: async (payload) => {
    const id = payload

    const population = {
      path: 'posts',
      select: '_id text author date comments',
      populate: {
        path: 'comments',
        select: '_id text author date',
      },
    }

    const user = await User
      .findById(id, '_id nickname date posts')
      .populate(population)

    return user
  },

  getFriends: async (payload) => {
    const id = payload

    const friends = await FriendRelation
      .find({
        from: id,
      })
      .select('to')
      .populate({
        path: 'to',
        select: '_id nickname date',
      })
      .map((relations) => relations.map((rel) => ({
        _id: rel.to._id,
        nickname: rel.to.nickname,
        date: rel.to.date,
      })))

    return friends
  },

  create: async (payload) => {
    const { nickname, password } = payload

    const existingUser = await User
      .findOne({ nickname })

    if (existingUser) throw new Error('User already exists')

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      nickname,
      password: hashedPassword,
    })

    await user.save()
  },

  login: async (payload) => {
    const { nickname, password } = payload

    const user = await User
      .findOne({ nickname })

    if (!user) throw new Error('Incorrect nickname or password')

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) throw new Error('Incorrect nickname or password')

    return getToken(user._id)
  },
}

module.exports = UserService
