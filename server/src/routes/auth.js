import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import { signToken, serializeUser, authRequired, loadUser } from '../middleware.js'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const email = parsed.data.email.toLowerCase().trim()
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return res.status(409).json({ error: 'Email already registered' })

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone || null,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: 'customer'
    },
    include: { seller: true }
  })

  const token = signToken(user)
  res.status(201).json({ token, user: serializeUser(user) })
})

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim()
  const password = String(req.body.password || '')
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const user = await prisma.user.findUnique({ where: { email }, include: { seller: true } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

  res.json({ token: signToken(user), user: serializeUser(user) })
})

router.get('/me', authRequired, loadUser, async (req, res) => {
  if (!req.dbUser) return res.status(404).json({ error: 'User not found' })
  res.json({ user: serializeUser(req.dbUser) })
})

router.patch('/me', authRequired, loadUser, async (req, res) => {
  if (!req.dbUser) return res.status(404).json({ error: 'User not found' })
  const name = req.body.name ? String(req.body.name).trim() : undefined
  const phone = req.body.phone !== undefined ? String(req.body.phone) : undefined
  const user = await prisma.user.update({
    where: { id: req.dbUser.id },
    data: {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {})
    },
    include: { seller: true }
  })
  res.json({ user: serializeUser(user) })
})

router.post('/forgot-password', async (req, res) => {
  // Production: send email with reset token. For now acknowledge request.
  res.json({
    ok: true,
    message: 'If an account exists for that email, reset instructions will be sent.'
  })
})

export default router
