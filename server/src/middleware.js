import jwt from 'jsonwebtoken'
import { prisma } from './prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'lumina-dev-secret'

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch {
      /* ignore */
    }
  }
  next()
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}

export async function loadUser(req, res, next) {
  if (!req.user?.sub) return next()
  try {
    req.dbUser = await prisma.user.findUnique({
      where: { id: req.user.sub },
      include: { seller: true }
    })
  } catch {
    /* ignore */
  }
  next()
}

export function parseJson(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function serializeProduct(p) {
  if (!p) return null
  return {
    id: p.id,
    name: p.name,
    brand: p.brandId,
    category: p.categoryId,
    sellerId: p.sellerId,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviews: p.reviewsCount,
    image: p.image,
    images: parseJson(p.images, [p.image]),
    badges: parseJson(p.badges, []),
    flashPercent: p.flashPercent,
    stock: p.stock,
    colors: parseJson(p.colors, []),
    description: p.description,
    specs: parseJson(p.specs, []),
    active: p.active,
    seller: p.seller
      ? {
          id: p.seller.id,
          name: p.seller.name,
          country: p.seller.country,
          image: p.seller.image,
          rating: p.seller.rating,
          followers: p.seller.followers,
          response: p.seller.response,
          since: p.seller.since,
          status: p.seller.status
        }
      : undefined
  }
}

export function serializeSeller(s) {
  if (!s) return null
  return {
    id: s.id,
    name: s.name,
    country: s.country,
    image: s.image,
    status: s.status,
    approved: s.status === 'approved',
    commissionRate: s.commissionRate,
    rating: s.rating,
    followers: s.followers,
    response: s.response,
    since: s.since,
    bio: s.bio,
    earnings: s.earnings,
    userId: s.userId
  }
}

export function serializeUser(u) {
  if (!u) return null
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    phone: u.phone,
    sellerId: u.seller?.id || null,
    sellerStatus: u.seller?.status || null
  }
}
