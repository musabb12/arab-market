import { Router } from 'express'
import { prisma } from '../prisma.js'
import {
  authRequired,
  requireRoles,
  loadUser,
  serializeProduct,
  serializeSeller,
  parseJson
} from '../middleware.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'lumina-api', time: new Date().toISOString() })
})

router.get('/catalog', async (_req, res) => {
  const [products, sellers, categories, brands, coupons, settingsRows] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { seller: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.seller.findMany({ where: { status: 'approved' } }),
    prisma.category.findMany(),
    prisma.brand.findMany(),
    prisma.coupon.findMany({ where: { status: 'active' } }),
    prisma.siteSetting.findMany()
  ])

  const settings = {}
  for (const row of settingsRows) {
    settings[row.key] = parseJson(row.value, row.value)
  }

  res.json({
    products: products.map(serializeProduct),
    sellers: sellers.map(serializeSeller),
    categories: categories.map((c) => ({
      id: c.id,
      nameKey: c.nameKey,
      image: c.image,
      gradient: c.gradient,
      description: c.description,
      subcategories: parseJson(c.subcategories, [])
    })),
    brands: brands.map((b) => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      description: b.description
    })),
    coupons: coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: c.value,
      discount: c.value,
      status: c.status,
      used: c.used,
      limit: c.limit,
      minOrder: c.minOrder
    })),
    settings,
    payments: [
      { id: 'card', name: 'Credit / Debit Card', enabled: Boolean(process.env.STRIPE_SECRET_KEY) },
      { id: 'cod', name: 'Cash on Delivery', enabled: true },
      { id: 'paypal', name: 'PayPal', enabled: false },
      { id: 'applepay', name: 'Apple Pay', enabled: false },
      { id: 'googlepay', name: 'Google Pay', enabled: false }
    ],
    shippingMethods: [
      {
        id: 'standard',
        name: 'Standard Delivery (5-8 days)',
        fee: settings.shippingFee ?? 0,
        enabled: true,
        eta: '5-8 days'
      },
      {
        id: 'express',
        name: 'Express Delivery (2-3 days)',
        fee: settings.expressFee ?? 19.95,
        enabled: true,
        eta: '2-3 days'
      }
    ]
  })
})

router.get('/products', async (req, res) => {
  const where = { active: true }
  if (req.query.category) where.categoryId = String(req.query.category)
  if (req.query.sellerId) where.sellerId = String(req.query.sellerId)
  if (req.query.q) {
    where.name = { contains: String(req.query.q) }
  }

  const products = await prisma.product.findMany({
    where,
    include: { seller: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ products: products.map(serializeProduct) })
})

router.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { seller: true }
  })
  if (!product || !product.active) return res.status(404).json({ error: 'Product not found' })
  res.json({ product: serializeProduct(product) })
})

router.get('/sellers', async (_req, res) => {
  const sellers = await prisma.seller.findMany({ where: { status: 'approved' } })
  res.json({ sellers: sellers.map(serializeSeller) })
})

router.get('/sellers/:id', async (req, res) => {
  const seller = await prisma.seller.findUnique({ where: { id: req.params.id } })
  if (!seller || seller.status !== 'approved') return res.status(404).json({ error: 'Seller not found' })
  const products = await prisma.product.findMany({
    where: { sellerId: seller.id, active: true },
    include: { seller: true }
  })
  res.json({
    seller: serializeSeller(seller),
    products: products.map(serializeProduct)
  })
})

router.get('/coupons/:code', async (req, res) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: String(req.params.code).toUpperCase() }
  })
  if (!coupon || coupon.status !== 'active') return res.status(404).json({ error: 'Invalid coupon' })
  if (coupon.used >= coupon.limit) return res.status(400).json({ error: 'Coupon limit reached' })
  res.json({
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: coupon.value,
      minOrder: coupon.minOrder
    }
  })
})

export default router
