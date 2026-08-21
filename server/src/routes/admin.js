import { Router } from 'express'
import { prisma } from '../prisma.js'
import {
  authRequired,
  requireRoles,
  serializeProduct,
  serializeSeller,
  serializeUser,
  parseJson
} from '../middleware.js'

const router = Router()

router.use(authRequired, requireRoles('admin', 'manager'))

router.get('/overview', async (_req, res) => {
  const [productCount, orderCount, sellerCount, userCount, orders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.seller.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { items: true } })
  ])
  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: { in: ['paid', 'cod'] } }
  })
  const pendingSellers = await prisma.seller.count({ where: { status: 'pending' } })

  res.json({
    stats: {
      products: productCount,
      orders: orderCount,
      sellers: sellerCount,
      customers: userCount,
      revenue: revenue._sum.total || 0,
      pendingSellers
    },
    recentOrders: orders.map((o) => ({
      id: o.id,
      email: o.email,
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      date: o.createdAt.toISOString()
    }))
  })
})

router.get('/products', async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { updatedAt: 'desc' }
  })
  res.json({ products: products.map(serializeProduct) })
})

router.post('/products', async (req, res) => {
  const d = req.body
  const product = await prisma.product.create({
    data: {
      name: d.name,
      brandId: d.brand || d.brandId || '',
      categoryId: d.category || d.categoryId,
      sellerId: d.sellerId,
      price: Number(d.price),
      originalPrice: d.originalPrice != null ? Number(d.originalPrice) : null,
      image: d.image,
      images: JSON.stringify(d.images || [d.image]),
      badges: JSON.stringify(d.badges || []),
      stock: Number(d.stock || 0),
      colors: JSON.stringify(d.colors || []),
      description: d.description || '',
      specs: JSON.stringify(d.specs || []),
      active: d.active !== false,
      flashPercent: d.flashPercent ?? null
    },
    include: { seller: true }
  })
  res.status(201).json({ product: serializeProduct(product) })
})

router.patch('/products/:id', async (req, res) => {
  const d = req.body
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      ...(d.name != null ? { name: d.name } : {}),
      ...(d.price != null ? { price: Number(d.price) } : {}),
      ...(d.stock != null ? { stock: Number(d.stock) } : {}),
      ...(d.active != null ? { active: Boolean(d.active) } : {}),
      ...(d.sellerId ? { sellerId: d.sellerId } : {}),
      ...(d.category || d.categoryId ? { categoryId: d.category || d.categoryId } : {}),
      ...(d.image ? { image: d.image } : {}),
      ...(d.badges ? { badges: JSON.stringify(d.badges) } : {}),
      ...(d.description != null ? { description: d.description } : {})
    },
    include: { seller: true }
  })
  res.json({ product: serializeProduct(product) })
})

router.delete('/products/:id', async (req, res) => {
  await prisma.product.update({ where: { id: req.params.id }, data: { active: false } })
  res.json({ ok: true })
})

router.get('/sellers', async (_req, res) => {
  const sellers = await prisma.seller.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ sellers: sellers.map(serializeSeller) })
})

router.patch('/sellers/:id', async (req, res) => {
  const d = req.body
  const seller = await prisma.seller.update({
    where: { id: req.params.id },
    data: {
      ...(d.name != null ? { name: d.name } : {}),
      ...(d.status != null ? { status: d.status } : {}),
      ...(d.commissionRate != null ? { commissionRate: Number(d.commissionRate) } : {}),
      ...(d.country != null ? { country: d.country } : {})
    }
  })

  if (d.status === 'approved' && seller.userId) {
    await prisma.user.update({ where: { id: seller.userId }, data: { role: 'seller' } })
  }

  res.json({ seller: serializeSeller(seller) })
})

router.get('/orders', async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      email: o.email,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: o.total,
      subtotal: o.subtotal,
      date: o.createdAt.toISOString(),
      items: o.items
    }))
  })
})

router.patch('/orders/:id', async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: {
      ...(req.body.status ? { status: req.body.status } : {}),
      ...(req.body.paymentStatus ? { paymentStatus: req.body.paymentStatus } : {})
    },
    include: { items: true }
  })
  res.json({ order })
})

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { seller: true, orders: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json({
    users: users.map((u) => ({
      ...serializeUser(u),
      orders: u.orders.length,
      spent: u.orders.reduce((s, o) => s + o.total, 0),
      joined: u.createdAt.toISOString().slice(0, 10),
      status: 'active'
    }))
  })
})

router.get('/settings', async (_req, res) => {
  const rows = await prisma.siteSetting.findMany()
  const settings = {}
  for (const row of rows) settings[row.key] = parseJson(row.value, row.value)
  res.json({ settings })
})

router.patch('/settings', async (req, res) => {
  const entries = Object.entries(req.body || {})
  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: JSON.stringify(value) },
      update: { value: JSON.stringify(value) }
    })
  }
  res.json({ ok: true })
})

export default router
