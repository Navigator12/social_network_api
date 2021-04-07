const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const { PORT, MONGO } = process.env

const app = express()

app.use(express.json({ extended: true }))
app.use(cors())

app.use('/api/users', require('./routes/User'))
app.use('/api/posts', require('./routes/Post'))
app.use('/api/friend_request', require('./routes/FriendRequest'))

const startDB = async () => {
  try {
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (e) {
    console.error('DATABASE ERROR')
    process.exit(1)
  }
}

startDB().then(() => {
  console.log('Successfully connected to DB')
  app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
})
