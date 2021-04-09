const bcrypt = require('bcrypt')

const User = require('../models/User')
const FriendRelation = require('../models/FriendRelation')
const { getToken } = require('../utils/Token')

const UserService = {
  getAllUsers: async () => {
    const format = {
      posts: 0,
      password: 0,
      __v: 0,
    }

    const users = await User.find({}, format)

    return users
  },

  getUserById: async (payload) => {
    const id = payload

    const format = {
      password: 0,
      __v: 0,
      posts: 0,
    }

    const user = await User.findById(id, format)

    return user
  },

  getUserByIdWithPosts: async (payload) => {
    const id = payload

    const format = {
      password: 0,
      __v: 0,
    }

    const population = {
      path: 'posts',
      select: '-__v -author',
      populate: {
        path: 'comments',
        select: '-__v',
      },
    }

    const user = await User.findById(id, format).populate(population)

    return user
  },

  getFriends: async (payload) => {
    const id = payload

    const selectRelation = 'to date'
    const selectUser = '_id nickname'

    const friends = await FriendRelation
      .find({
        from: id,
      })
      .select(selectRelation)
      .populate({
        path: 'to',
        select: selectUser,
      })
      .map((relations) => relations.map((rel) => ({
        _id: rel.to._id,
        nickname: rel.to.nickname,
        date: rel.date,
      })))

    return friends
  },

  create: async (payload) => {
    const { nickname, password } = payload

    const existingUser = await User.findOne({ nickname })

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

    const user = await User.findOne({ nickname })

    if (!user) throw new Error('Incorrect nickname or password')

    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) throw new Error('Incorrect nickname or password')

    return getToken(user._id)
  },
}

module.exports = UserService
