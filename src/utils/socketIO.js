import socket from 'socket.io'

const store = {
  users: {},
  messages: [],
}

// Constants
const SET_NAME = 'set-name'
const USER_LIST = 'user-list'
const MESSAGE = 'message'
const MESSAGES = 'messages'

export function createSocketIO(httpServer) {
  const ChatIO = socket(httpServer, { path: '/chat' })

  ChatIO.on('connect', (user) => {
    store.users[user.id] = {
      name: 'Unknown user',
      online: true,
      joinedAt: +new Date(),
    }

    // User sets name
    user.on(SET_NAME, (name) => {
      // Update user's new name to store object
      store.users[user.id].name = name

      // Send user's new name to all clients except user
      user.broadcast.emit(USER_LIST, store.users)
    })

    user.on(USER_LIST, () => {
      user.emit(USER_LIST, store.users)
    })

    user.on(MESSAGES, ({ limit, offset = 0 }) => {
      const totalMessages = store.messages.length

      const from = totalMessages - offset - limit < 0 ? 0 : totalMessages - offset - limit

      user.emit(MESSAGES, {
        messages: store.messages.slice(from, totalMessages - offset),
        total: totalMessages,
      })
    })

    // User send message
    user.on(MESSAGE, ({ message, key }) => {
      const messageObj = {
        uid: user.id,
        username: store.users[user.id].name,
        key,
        message,
        sentAt: +new Date(),
      }

      // Add message to store
      store.messages.push(messageObj)

      // Notify there's a new message to everyone
      ChatIO.emit(MESSAGE, messageObj)
    })

    user.on('disconnect', () => {
      // Delete user from store
      store.users[user.id].online = false
      store.users[user.id].leftAt = +new Date()

      // Notify that new user disconnected
      user.broadcast.emit(USER_LIST, store.users)
    })
  })
}
