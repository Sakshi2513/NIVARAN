import 'dotenv/config'
import 'express-async-errors'
import app from './app'
import { connectDatabase } from './config/db'

import { createServer } from 'http'
import { initSocketServer } from './socket'

const port = Number(process.env.PORT ?? 5000)

const httpServer = createServer(app)

// Initialize WebSocket Engine
initSocketServer(httpServer)

connectDatabase().then(() => {
  httpServer.listen(port, () => {
    console.log(`Backend listening on http://0.0.0.0:${port}`)
    console.log(`WebSocket Engine initialized`)
  })
})
