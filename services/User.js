const bcrypt = require('bcrypt')

const User = require('../models/User')
const { getToken } = require('../utils/Token')

const UserService = {
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
