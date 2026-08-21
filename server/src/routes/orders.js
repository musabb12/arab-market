import { Router } from 'express'
import { z } from 'zod'
import Stripe from 'stripe'
import { prisma } from '../prisma.js'
import { authRequired, optionalAuth, loadUser, parseJson } from '../middleware.js'

const router = Router()

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

async function getSettings() {
  const rows = await prisma.siteSetting.findMany()
  const settings = {}
  for (const row of rows) settings[row.key] = parseJson(row.value, row.value)
  return settings
}

const checkoutSchema = z.object({
  email: z.string().email(),
  paymentMethod: z.enum(['cod', 'card']),
  deliveryMethod: z.enum(['standard', 'express']).default('standard'),
  currency: z.string().default('USD'),
  couponCode: z.string().optional(),
  address: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    line1: z.string().min(3),
    city: z.string().min(1),
    state: z.string().optional(),
    zip: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional()
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.number().int().positive()
      })
    )
    .min(1)
})

async function priceCart(items, deliveryMethod, couponCode) {
  const settings = await getSettings()
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true }
  })
  const byId = Object.fromEntries(products.map((p) => [p.id, p]))

  const lineItems = []
  let subtotal = 0
  for (const item of items) {
    const product = byId[item.productId]
    if (!product) throw Object.assign(new Error(`Product ${item.productId} not found`), { status: 400 })
    if (product.stock < item.qty) {
      throw Object.assign(new Error(`Insufficient stock for ${product.name}`), { status: 400 })
    }
    subtotal += product.price * item.qty
    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
      image: product.image,
      sellerId: product.sellerId
    })
  }

  let shippingFee = deliveryMethod === 'express' ? Number(settings.expressFee ?? 19.95) : 0
  const threshold = Number(settings.freeShippingThreshold ?? 99)
  if (deliveryMethod === 'standard' && subtotal < threshold) {
    shippingFee = Number(settings.shippingFee ?? 9.95)
  }
  if (deliveryMethod === 'standard' && subtotal >= threshold) shippingFee = 0

  let discount = 0
  let coupon = null
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
    if (!coupon || coupon.status !== 'active' || coupon.used >= coupon.limit) {
      throw Object.assign(new Error('Invalid coupon'), { status: 400 })
    }
    if (subtotal < coupon.minOrder) {
      throw Object.assign(new Error(`Minimum order for coupon is ${coupon.minOrder}`), { status: 400 })
    }
    discount = coupon.type === 'fixed' ? coupon.value : (subtotal * coupon.value) / 100
  }

  const taxRate = Number(settings.taxRate ?? 5) / 100
  const taxable = Math.max(0, subtotal + shippingFee - discount)
  const tax = taxable * taxRate
  const total = taxable + tax

  return { lineItems, subtotal, shippingFee, discount, tax, total, coupon, settings }
}

router.post('/checkout', optionalAuth, loadUser, async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  try {
    const data = parsed.data
    if (data.paymentMethod === 'card' && !process.env.STRIPE_SECRET_KEY) {
      return res.status(400).json({
        error: 'Card payments are not configured. Use Cash on Delivery or set STRIPE_SECRET_KEY.'
      })
    }

    const priced = await priceCart(data.items, data.deliveryMethod, data.couponCode)

    if (data.paymentMethod === 'cod') {
      const order = await createOrder({
        ...data,
        ...priced,
        paymentStatus: 'cod',
        status: 'confirmed',
        userId: req.dbUser?.id || null
      })
      return res.status(201).json({ order, checkoutUrl: null })
    }

    const stripe = getStripe()
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: data.email,
      success_url: `${clientUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/checkout?cancelled=1`,
      line_items: [
        ...priced.lineItems.map((i) => ({
          quantity: i.qty,
          price_data: {
            currency: (data.currency || 'USD').toLowerCase(),
            unit_amount: Math.round(i.price * 100),
            product_data: { name: i.name, images: i.image ? [i.image] : [] }
          }
        })),
        ...(priced.shippingFee > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: (data.currency || 'USD').toLowerCase(),
                  unit_amount: Math.round(priced.shippingFee * 100),
                  product_data: { name: 'Shipping' }
                }
              }
            ]
          : []),
        ...(priced.tax > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: (data.currency || 'USD').toLowerCase(),
                  unit_amount: Math.round(priced.tax * 100),
                  product_data: { name: 'Tax' }
                }
              }
            ]
          : [])
      ],
      metadata: {
        email: data.email,
        deliveryMethod: data.deliveryMethod,
        couponCode: data.couponCode || '',
        userId: req.dbUser?.id || '',
        address: JSON.stringify(data.address),
        items: JSON.stringify(data.items)
      }
    })

    const order = await createOrder({
      ...data,
      ...priced,
      paymentStatus: 'pending',
      status: 'awaiting_payment',
      stripeSessionId: session.id,
      userId: req.dbUser?.id || null
    })

    res.status(201).json({ order, checkoutUrl: session.url })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Checkout failed' })
  }
})

async function createOrder({
  email,
  paymentMethod,
  deliveryMethod,
  currency,
  address,
  lineItems,
  subtotal,
  shippingFee,
  discount,
  tax,
  total,
  coupon,
  paymentStatus,
  status,
  stripeSessionId,
  userId
}) {
  return prisma.$transaction(async (tx) => {
    for (const item of lineItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } }
      })
    }

    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { used: { increment: 1 } }
      })
    }

    const order = await tx.order.create({
      data: {
        userId,
        email,
        status,
        paymentMethod,
        paymentStatus,
        stripeSessionId: stripeSessionId || null,
        subtotal,
        shippingFee,
        tax,
        discount,
        total,
        currency: currency || 'USD',
        shippingAddress: JSON.stringify(address),
        deliveryMethod,
        items: {
          create: lineItems.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
            sellerId: i.sellerId
          }))
        }
      },
      include: { items: true }
    })

    const sellerTotals = {}
    for (const i of lineItems) {
      sellerTotals[i.sellerId] = (sellerTotals[i.sellerId] || 0) + i.price * i.qty
    }
    for (const [sellerId, amount] of Object.entries(sellerTotals)) {
      const seller = await tx.seller.findUnique({ where: { id: sellerId } })
      if (!seller) continue
      const net = amount * (1 - seller.commissionRate / 100)
      await tx.seller.update({
        where: { id: sellerId },
        data: { earnings: { increment: net } }
      })
    }

    return formatOrder(order)
  })
}

function formatOrder(order) {
  return {
    id: order.id,
    email: order.email,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    tax: order.tax,
    discount: order.discount,
    total: order.total,
    currency: order.currency,
    delivery: order.deliveryMethod,
    address: parseJson(order.shippingAddress, {}),
    date: order.createdAt.toISOString(),
    items: (order.items || []).map((i) => ({
      id: i.productId,
      qty: i.qty,
      product: {
        id: i.productId,
        name: i.name,
        price: i.price,
        image: i.image,
        sellerId: i.sellerId
      }
    }))
  }
}

router.get('/orders/mine', authRequired, loadUser, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      OR: [{ userId: req.dbUser.id }, { email: req.dbUser.email }]
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ orders: orders.map(formatOrder) })
})

router.get('/orders/:id', optionalAuth, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true }
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json({ order: formatOrder(order) })
})

router.get('/orders/by-session/:sessionId', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { stripeSessionId: req.params.sessionId },
    include: { items: true }
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })

  if (order.paymentStatus === 'pending' && process.env.STRIPE_SECRET_KEY) {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId)
    if (session.payment_status === 'paid') {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'paid', status: 'confirmed' },
        include: { items: true }
      })
      return res.json({ order: formatOrder(updated) })
    }
  }

  res.json({ order: formatOrder(order) })
})

router.post('/track', async (req, res) => {
  const id = String(req.body.orderId || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  if (!id || !email) return res.status(400).json({ error: 'Order ID and email required' })
  const order = await prisma.order.findFirst({
    where: { id, email },
    include: { items: true }
  })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json({ order: formatOrder(order) })
})

export default router
