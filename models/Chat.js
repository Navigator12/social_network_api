const { Schema, model, Types } = require('mongoose')

const chatSchema = new Schema({
  user1: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  user2: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  messages: [{
    type: Types.ObjectId,
    ref: 'Message',
  }],
})

chatSchema.index({
  user1: 1,
  user2: 1,
}, {
  unique: true,
})

module.exports = model('Chat', chatSchema)
