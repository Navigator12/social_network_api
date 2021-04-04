const { Schema, model, Types } = require('mongoose')

const postSchema = new Schema({
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

  comments: [{
    type: Types.ObjectId,
    ref: 'Comment',
  }],
})

module.exports = model('Post', postSchema)
