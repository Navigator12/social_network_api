const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },

  password: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  posts: [{
    type: Types.ObjectId,
    ref: 'Post',
  }],

  chats: [{
    type: Types.ObjectId,
    ref: 'Chat',
  }],
})

module.exports = model('User', userSchema)
