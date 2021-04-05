const { Schema, model, Types } = require('mongoose')

const friendRequestSchema = new Schema({
  from: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  to: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },

  date: {
    type: Date,
    default: Date.now,
  },
})

friendRequestSchema.index({
  from: 1,
  to: 1,
}, {
  unique: true,
})

module.exports = model('Friend request', friendRequestSchema)
