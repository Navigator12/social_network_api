const { verifyToken } = require('./Token')

const AttachUser = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()

  const token = req.headers.authorization.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Not authorized' })

  req.user = verifyToken(token)

  return next()
}

module.exports = AttachUser
