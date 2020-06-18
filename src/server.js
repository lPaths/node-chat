import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'

import { info } from './utils/chalk'
import { createSocketIO } from './utils/socketIO'

async function main() {
  // Initializes application
  const app = express()

  // Enable cors
  app.use(cors())

  // Create http server
  const httpServer = createServer(app)

  // Initialize socketIO
  createSocketIO(httpServer)

  // Listen to HTTP and WebSocket server
  const PORT = process.env.PORT || process.env.API_PORT
  httpServer.listen({ port: PORT }, () => {
    info(`Server ready at port ${PORT}`)
  })
}

main()
