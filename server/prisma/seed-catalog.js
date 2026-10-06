import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { products, sellers } from '../../src/data/products.js'
import { categories, brands, couponCodes } from '../../src/data/categories.js'

/** Replace the catalog only. Users, accounts, addresses and orders are kept. */
const prisma = new PrismaClient()

async function main() {
  for (const s of sellers) {
    const data = {
      name: s.name,
      country: s.country,
      image: s.image,
      rating: s.rating,
      followers: s.followers,
      response: s.response,
      since: s.since
    }
    await prisma.seller.upsert({
      where: { id: s.id },
      update: data,
      create: { id: s.id, ...data, status: 'approved', commissionRate: 8 }
    })
  }

  await prisma.category.deleteMany()
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

  await prisma.brand.deleteMany()
  for (const b of brands) {
    await prisma.brand.create({
      data: { id: b.id, name: b.name, logo: b.logo || '', description: b.description || '' }
    })
  }

  for (const p of products) {
    const data = {
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
    await prisma.product.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } })
  }

  const keep = new Set(products.map((p) => p.id))
  const stale = (await prisma.product.findMany({ select: { id: true } })).filter((p) => !keep.has(p.id))
  let removed = 0
  let hidden = 0
  for (const { id } of stale) {
    const ordered = await prisma.orderItem.count({ where: { productId: id } })
    if (ordered) {
      await prisma.product.update({ where: { id }, data: { active: false } })
      hidden++
    } else {
      await prisma.review.deleteMany({ where: { productId: id } })
      await prisma.product.delete({ where: { id } })
      removed++
    }
  }

  await prisma.coupon.deleteMany()
  for (const [i, c] of couponCodes.entries()) {
    await prisma.coupon.create({
      data: {
        id: `cp${i + 1}`,
        code: c.code,
        type: 'percent',
        value: c.discount,
        status: 'active',
        used: 0,
        limit: c.limit || 100,
        minOrder: c.minOrder || 0
      }
    })
  }

  for (const [key, value] of Object.entries({ siteName: 'Ciar', siteSuffix: 'VIP', tagline: 'Premium Marketplace', logoText: 'C' })) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    })
  }

  console.log(`Catalog ready: ${products.length} products, ${categories.length} categories, ${brands.length} brands.`)
  console.log(`Old products removed: ${removed}, hidden (referenced by orders): ${hidden}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
