import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import complaintRoutes from './routes/complaintRoutes'
import analyticsRoutes from './routes/analyticsRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend' })
})

app.use(errorHandler)

export default app
