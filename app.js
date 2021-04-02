const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const { PORT, MONGO } = process.env

const app = express()

const startDB = async () => {
  try {
    await mongoose.connect(MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (e) {
    console.error('DATABASE ERROR')
    process.exit(1)
  }
}

startDB().then(() => {
  console.log("Successfully connected to DB")
  app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
})
