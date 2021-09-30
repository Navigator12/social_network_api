const { Schema, model, Types } = require('mongoose')

const messageSchema = new Schema({
  chat: {
    type: Types.ObjectId,
    required: true,
    ref: 'Chat',
  },

  from: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  text: {
    type: String,
    required: true,
    minlength: 1,
  },

  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = model('Message', messageSchema)
