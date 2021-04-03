const jwt = require('jsonwebtoken')

const getToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '6hr' })

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {
  getToken,
  verifyToken,
}
