const SocketIO = require('socket.io')

class Socket {
  static io = null

  static initialize(server) {
    Socket.io = new SocketIO.Server(server, {
      cors: {
        origin: '*',
      },
    })
  }

  static getIO() {
    return Socket.io
  }
}

module.exports = Socket
