const { verifyToken } = require('./Token')

const AttachUser = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') return next()

    const token = req.headers.authorization.split(' ')[1]

    req.user = verifyToken(token)

    return next()
  } catch (e) {
    return res.status(401).json({
      message: 'Not authorized',
    })
  }
}

module.exports = AttachUser
