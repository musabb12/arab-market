import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import catalogRoutes from './routes/catalog.js'
import sellerRoutes from './routes/sellers.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT || 4010)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
)
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'lumina-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api', catalogRoutes)
app.use('/api/seller', sellerRoutes)
app.use('/api', orderRoutes)
app.use('/api/admin', adminRoutes)

const distPath = path.join(__dirname, '../../dist')
app.use(express.static(distPath))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Not found. Run frontend build for production.' })
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Lumina API listening on http://localhost:${PORT}`)
})
