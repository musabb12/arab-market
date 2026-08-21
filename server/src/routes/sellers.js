import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma.js'
import {
  authRequired,
  loadUser,
  serializeSeller,
  serializeProduct,
  requireRoles
} from '../middleware.js'

const router = Router()

const applySchema = z.object({
  storeName: z.string().min(2),
  country: z.string().min(2),
  bio: z.string().optional(),
  image: z.string().url().optional().or(z.literal(''))
})

router.post('/apply', authRequired, loadUser, async (req, res) => {
  if (!req.dbUser) return res.status(401).json({ error: 'Authentication required' })
  if (req.dbUser.seller) {
    return res.status(400).json({
      error: 'You already have a seller account',
      seller: serializeSeller(req.dbUser.seller)
    })
  }

  const parsed = applySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const year = String(new Date().getFullYear())
  const seller = await prisma.seller.create({
    data: {
      userId: req.dbUser.id,
      name: parsed.data.storeName.trim(),
      country: parsed.data.country.trim(),
      bio: parsed.data.bio || '',
      image:
        parsed.data.image ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
      status: 'pending',
      since: year,
      response: 'within 24 hours'
    }
  })

  await prisma.user.update({
    where: { id: req.dbUser.id },
    data: { role: 'seller' }
  })

  res.status(201).json({
    seller: serializeSeller(seller),
    message: 'Application submitted. An admin will review it shortly.'
  })
})

router.get('/me', authRequired, loadUser, async (req, res) => {
  if (!req.dbUser?.seller) return res.status(404).json({ error: 'No seller profile' })
  const seller = req.dbUser.seller
  const products = await prisma.product.findMany({
    where: { sellerId: seller.id },
    include: { seller: true },
    orderBy: { createdAt: 'desc' }
  })
  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: seller.id },
    include: { order: true },
    orderBy: { order: { createdAt: 'desc' } },
    take: 50
  })

  const revenue = orderItems.reduce((s, i) => s + i.price * i.qty, 0)
  const pendingOrders = new Set(
    orderItems.filter((i) => !['delivered', 'cancelled'].includes(i.order.status)).map((i) => i.orderId)
  ).size

  const today = new Date().toISOString().slice(0, 10)
  const todayRevenue = orderItems
    .filter((i) => i.order.createdAt.toISOString().slice(0, 10) === today)
    .reduce((s, i) => s + i.price * i.qty, 0)

  const recentOrdersMap = new Map()
  for (const item of orderItems) {
    if (!recentOrdersMap.has(item.orderId)) {
      recentOrdersMap.set(item.orderId, {
        id: item.order.id,
        customer: item.order.email,
        date: item.order.createdAt.toISOString().slice(0, 10),
        total: 0,
        status: item.order.status
      })
    }
    recentOrdersMap.get(item.orderId).total += item.price * item.qty
  }

  res.json({
    seller: serializeSeller(seller),
    products: products.map(serializeProduct),
    stats: {
      revenue,
      todayRevenue,
      pendingOrders,
      productsActive: products.filter((p) => p.active).length
    },
    recentOrders: [...recentOrdersMap.values()].slice(0, 10)
  })
})

const productSchema = z.object({
  name: z.string().min(2),
  brandId: z.string().optional(),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional().nullable(),
  image: z.string().url(),
  images: z.array(z.string()).optional(),
  stock: z.number().int().min(0).default(0),
  description: z.string().optional(),
  specs: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  active: z.boolean().optional()
})

router.post('/products', authRequired, loadUser, async (req, res) => {
  const seller = req.dbUser?.seller
  if (!seller) return res.status(403).json({ error: 'Seller account required' })
  if (seller.status !== 'approved') {
    return res.status(403).json({ error: 'Seller account is not approved yet' })
  }

  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const d = parsed.data

  const product = await prisma.product.create({
    data: {
      name: d.name,
      brandId: d.brandId || '',
      categoryId: d.categoryId,
      sellerId: seller.id,
      price: d.price,
      originalPrice: d.originalPrice ?? null,
      image: d.image,
      images: JSON.stringify(d.images || [d.image]),
      stock: d.stock,
      description: d.description || '',
      specs: JSON.stringify(d.specs || []),
      badges: JSON.stringify(d.badges || []),
      colors: JSON.stringify(d.colors || []),
      active: d.active !== false
    },
    include: { seller: true }
  })

  res.status(201).json({ product: serializeProduct(product) })
})

router.patch('/products/:id', authRequired, loadUser, async (req, res) => {
  const seller = req.dbUser?.seller
  if (!seller) return res.status(403).json({ error: 'Seller account required' })

  const existing = await prisma.product.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.sellerId !== seller.id) {
    return res.status(404).json({ error: 'Product not found' })
  }

  const d = req.body
  const product = await prisma.product.update({
    where: { id: existing.id },
    data: {
      ...(d.name ? { name: String(d.name) } : {}),
      ...(d.price != null ? { price: Number(d.price) } : {}),
      ...(d.originalPrice !== undefined ? { originalPrice: d.originalPrice == null ? null : Number(d.originalPrice) } : {}),
      ...(d.stock != null ? { stock: Number(d.stock) } : {}),
      ...(d.image ? { image: String(d.image) } : {}),
      ...(d.description != null ? { description: String(d.description) } : {}),
      ...(d.active != null ? { active: Boolean(d.active) } : {}),
      ...(d.categoryId ? { categoryId: String(d.categoryId) } : {}),
      ...(d.badges ? { badges: JSON.stringify(d.badges) } : {}),
      ...(d.specs ? { specs: JSON.stringify(d.specs) } : {})
    },
    include: { seller: true }
  })

  res.json({ product: serializeProduct(product) })
})

router.delete('/products/:id', authRequired, loadUser, async (req, res) => {
  const seller = req.dbUser?.seller
  if (!seller) return res.status(403).json({ error: 'Seller account required' })
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } })
  if (!existing || existing.sellerId !== seller.id) {
    return res.status(404).json({ error: 'Product not found' })
  }
  await prisma.product.update({ where: { id: existing.id }, data: { active: false } })
  res.json({ ok: true })
})

export default router
