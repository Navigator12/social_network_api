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

    const select = '-__v -password -posts'

    const relations = await FriendRelation.find({
      $or: [
        { user1: id },
        { user2: id },
      ],
    }).populate({
      path: 'user1',
      select,
    }).populate({
      path: 'user2',
      select,
    })

    const friends = relations.map((relation) => ({
      friend: relation.user1._id.toString() === id ? relation.user2 : relation.user1,
      date: relation.date,
    }))

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
