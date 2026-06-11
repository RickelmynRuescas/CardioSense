import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import measurementRoutes from './routes/measurements'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', project: 'CardioSense API' })
})

app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use('/measurements', measurementRoutes)

app.listen(PORT, () => {
  console.log(`CardioSense API rodando na porta ${PORT}`)
})
