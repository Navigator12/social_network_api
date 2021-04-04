const { Schema, model, Types } = require('mongoose')

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
  },

  author: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  date: {
    type: Date,
    default: Date.now,
  },

  post: {
    type: Types.ObjectId,
    required: true,
    ref: 'Post',
  },
})

module.exports = model('Comment', commentSchema)
