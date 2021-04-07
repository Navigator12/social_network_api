const { Schema, model, Types } = require('mongoose')

const friendRelationSchema = new Schema({
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

friendRelationSchema.index({
  from: 1,
  to: 1,
}, {
  unique: true,
})

module.exports = model('Friend relation', friendRelationSchema)
