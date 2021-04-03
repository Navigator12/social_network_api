const { Schema, model } = require('mongoose')

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
})

module.exports = model('User', userSchema)
