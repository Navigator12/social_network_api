const { Schema, model, Types } = require('mongoose')

const friendRelationSchema = new Schema({
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

  date: {
    type: Date,
    default: Date.now,
  },
})

friendRelationSchema.index({
  user1: 1,
  user2: 1,
}, {
  unique: true,
})

module.exports = model('Friend relation', friendRelationSchema)
