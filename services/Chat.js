const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

const ChatService = {
  create: async (payload) => {
    const { from, to } = payload

    const chat = new Chat({
      user1: from,
      user2: to,
    })

    const user1 = await User.findById(from)
    const user2 = await User.findById(to)

    user1.chats.push(chat._id)
    user2.chats.push(chat._id)

    await chat.save()

    await user1.save()
    await user2.save()

    return chat
  },

  find: async (payload) => {
    const { userId, otherId } = payload

    const chat = await Chat.findOne({
      $or: [
        { user1: userId, user2: otherId },
        { user1: otherId, user2: userId },
      ],
    })

    return chat
  },

  getUserChats: async (payload) => {
    const userId = payload

    const user = await User
      .findById(userId)
      .populate({
        path: 'chats',
        populate: {
          path: 'user1 user2',
          select: '_id nickname',
        },
        select: '_id user1 user2',
      })
      .lean()

    const chats = user.chats.map((chat) => ({
      _id: chat._id,
      user: String(chat.user1._id) === userId ? chat.user2 : chat.user1,
    }))

    return chats
  },

  write: async (payload) => {
    const { userId, chatId, text } = payload

    const chat = await Chat.findById(chatId)

    const message = new Message({
      chat: chat._id,
      from: userId,
      text,
    })

    await message.save()
    chat.messages.push(message._id)
    await chat.save()

    await message
      .populate({
        path: 'from',
        select: '_id nickname',
      })
      .execPopulate()

    const otherId = String(chat.user1) === userId ? String(chat.user2) : String(chat.user1)

    return {
      otherId,
      message,
    }
  },

  getChatWithMessages: async (payload) => {
    const { userId, otherId } = payload

    const chat = await Chat
      .findOne({
        $or: [
          { user1: userId, user2: otherId },
          { user1: otherId, user2: userId },
        ],
      })
      .populate({
        path: 'user1 user2',
        select: '_id nickname',
      })
      .populate({
        path: 'messages',
        options: {
          sort: { _id: -1 },
        },
        select: '_id from text date',
        populate: {
          path: 'from',
          select: '_id nickname',
        },
      })

    return chat && {
      _id: chat._id,
      user: String(chat.user1._id) === String(userId) ? chat.user2 : chat.user1,
      messages: chat.messages,
    }
  },
}

module.exports = ChatService
