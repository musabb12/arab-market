import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { products, sellers as seedSellers } from '../../src/data/products.js'
import { categories, brands, couponCodes } from '../../src/data/categories.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.address.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.siteSetting.deleteMany()

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@lumina.market',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: 'Site Administrator',
      role: 'admin'
    }
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@lumina.market',
      passwordHash: await bcrypt.hash('manager123', 10),
      name: 'Store Manager',
      role: 'manager'
    }
  })

  const sellerUsers = []
  for (const [i, s] of seedSellers.entries()) {
    const user = await prisma.user.create({
      data: {
        email: `seller${i + 1}@lumina.market`,
        passwordHash: await bcrypt.hash('seller123', 10),
        name: s.name,
        role: 'seller'
      }
    })
    sellerUsers.push(user)
    await prisma.seller.create({
      data: {
        id: s.id,
        userId: user.id,
        name: s.name,
        country: s.country,
        image: s.image,
        status: 'approved',
        commissionRate: 8,
        rating: s.rating,
        followers: s.followers,
        response: s.response,
        since: s.since,
        earnings: 0
      }
    })
  }

  for (const c of categories) {
    await prisma.category.create({
      data: {
        id: c.id,
        nameKey: c.nameKey,
        image: c.image,
        gradient: c.gradient || '',
        description: c.description || '',
        subcategories: JSON.stringify(c.subcategories || [])
      }
    })
  }

  for (const b of brands) {
    await prisma.brand.create({
      data: {
        id: b.id,
        name: b.name,
        logo: b.logo || b.image || '',
        description: b.description || ''
      }
    })
  }

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brandId: p.brand || '',
        categoryId: p.category,
        sellerId: p.sellerId || 's1',
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        rating: p.rating || 0,
        reviewsCount: p.reviews || 0,
        image: p.image,
        images: JSON.stringify(p.images || [p.image]),
        badges: JSON.stringify(p.badges || []),
        flashPercent: p.flashPercent ?? null,
        stock: p.stock ?? 0,
        colors: JSON.stringify(p.colors || []),
        description: p.description || '',
        specs: JSON.stringify(p.specs || []),
        active: true
      }
    })
  }

  for (const [i, c] of couponCodes.entries()) {
    await prisma.coupon.create({
      data: {
        id: `cp${i + 1}`,
        code: c.code,
        type: 'percent',
        value: c.discount ?? c.value ?? 10,
        status: 'active',
        used: 0,
        limit: c.limit || 100,
        minOrder: c.minOrder || 0
      }
    })
  }

  const settings = {
    siteName: 'Ciar',
    siteSuffix: 'VIP',
    tagline: 'Premium Marketplace',
    logoText: 'C',
    brandColor: '#e04418',
    accentColor: '#0f2137',
    freeShippingThreshold: 99,
    shippingFee: 9.95,
    expressFee: 19.95,
    taxRate: 5,
    defaultCurrency: 'USD',
    maintenanceMode: false,
    stripeEnabled: Boolean(process.env.STRIPE_SECRET_KEY)
  }

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({
      data: { key, value: JSON.stringify(value) }
    })
  }

  console.log('Seed complete.')
  console.log(`Admin: ${admin.email} / ${adminPassword}`)
  console.log(`Manager: ${manager.email} / manager123`)
  console.log('Demo sellers: seller1@lumina.market … seller4@lumina.market / seller123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
