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
  },

  getChatWithMessages: async (payload) => {
    const { userId, chatId } = payload

    const chat = await Chat
      .findOne({
        _id: chatId,
        $or: [
          { user1: userId },
          { user2: userId },
        ],
      })
      .populate('messages')

    return chat
  },
}

module.exports = ChatService
