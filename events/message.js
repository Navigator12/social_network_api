const Socket = require('../socket')
const ChatService = require('../services/Chat')

module.exports = () => {
  const io = Socket.getIO()

  io.on('connection', (socket) => {
    socket.join(socket.handshake.query.userId)

    socket.on('sendMessage', async (payload) => {
      const { userId, chatId, text } = payload

      const { otherId, message } = await ChatService.write({ userId, chatId, text })

      io.to(userId).to(otherId).emit('receiveMessage', { message })
    })
  })
}
