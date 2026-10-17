import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

router.post('/', (req, res) => {
  try {
    const dataUrl = req.body?.dataUrl
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image payload' })
    }
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) return res.status(400).json({ error: 'Invalid data URL' })
    const mime = match[1].toLowerCase()
    const ext = EXT[mime] || 'jpg'
    const buf = Buffer.from(match[2], 'base64')
    if (buf.length > 8 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large (max 8MB)' })
    }
    const filename = `${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`
    fs.writeFileSync(path.join(uploadsDir, filename), buf)
    res.status(201).json({ url: `/uploads/${filename}`, filename })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
