import { products as defaultProducts } from './products.js'
import { categories as defaultCategories, brands as defaultBrands, testimonials as defaultTestimonials, couponCodes as defaultCoupons } from './categories.js'
import { sellers as defaultSellers } from './products.js'

export const ALL_LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr', enabled: true },
  { code: 'ar', name: 'العربية', dir: 'rtl', enabled: true },
  { code: 'es', name: 'Español', dir: 'ltr', enabled: true },
  { code: 'fr', name: 'Français', dir: 'ltr', enabled: true },
  { code: 'de', name: 'Deutsch', dir: 'ltr', enabled: true },
  { code: 'zh', name: '中文', dir: 'ltr', enabled: true },
  { code: 'ja', name: '日本語', dir: 'ltr', enabled: true },
  { code: 'ru', name: 'Русский', dir: 'ltr', enabled: true },
  { code: 'tr', name: 'Türkçe', dir: 'ltr', enabled: true },
  { code: 'hi', name: 'हिन्दी', dir: 'ltr', enabled: true },
  { code: 'ms', name: 'Bahasa Melayu', dir: 'ltr', enabled: true }
]

export const ALL_CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, enabled: true },
  { code: 'EUR', symbol: '€', rate: 0.92, enabled: true },
  { code: 'GBP', symbol: '£', rate: 0.79, enabled: true },
  { code: 'AED', symbol: 'AED ', rate: 3.67, enabled: true },
  { code: 'SAR', symbol: 'SAR ', rate: 3.75, enabled: true },
  { code: 'CNY', symbol: '¥', rate: 7.2, enabled: true },
  { code: 'JPY', symbol: '¥', rate: 155, enabled: true },
  { code: 'RUB', symbol: '₽', rate: 92, enabled: true },
  { code: 'TRY', symbol: '₺', rate: 34.5, enabled: true },
  { code: 'INR', symbol: '₹', rate: 83.5, enabled: true }
]

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`

export const defaultSiteData = {
  products: defaultProducts.map((p) => ({ ...p, active: true, stockBase: p.stock })),
  categories: defaultCategories,
  brands: defaultBrands,
  sellers: defaultSellers.map((s) => ({ ...s, status: 'approved', earnings: 486000, approved: true, commissionRate: 8 })),
  coupons: defaultCoupons.map((c, i) => ({ id: `cp${i + 1}`, status: 'active', used: 0, limit: 100, ...c })),

  content: {
    announcement: 'Free worldwide shipping on orders over $99',
    heroSlides: [
      { id: 'h1', image: img('photo-1483985988355-763728e1935b'), title: 'Discover Luxury from Every Corner of the World', subtitle: 'Shop millions of premium products across fashion, electronics, beauty and home.', enabled: true },
      { id: 'h2', image: img('photo-1441986300917-64674bd600d8'), title: 'Elegant Boutiques & Timeless Style', subtitle: 'Curated fashion houses and refined essentials for every season.', enabled: true },
      { id: 'h3', image: img('photo-1498049794561-7780e7231661'), title: 'Next-Generation Electronics', subtitle: 'Flagship gadgets and smart living technology at unbeatable prices.', enabled: true },
      { id: 'h4', image: img('photo-1555041469-a586c61ea9bc'), title: 'Beautiful Homes, Thoughtful Design', subtitle: 'Furniture and décor that transform everyday living into luxury.', enabled: true },
      { id: 'h5', image: img('photo-1523275335684-37898b6baf30'), title: 'Iconic Watches & Fine Accessories', subtitle: 'Precision craftsmanship and signature pieces that last a lifetime.', enabled: true },
      { id: 'h6', image: img('photo-1607082349566-187342175e2f'), title: 'Gifts Worth Celebrating', subtitle: 'Premium gift sets and exclusive drops for every occasion.', enabled: true },
      { id: 'h7', image: img('photo-1553062407-98eeb64c6a62'), title: 'Crafted Leather & Everyday Luxury', subtitle: 'Handbags, wallets and travel pieces made with care.', enabled: true },
      { id: 'h8', image: img('photo-1505740420928-5e560c06d30e'), title: 'Sound That Moves You', subtitle: 'Studio-grade audio and immersive listening experiences.', enabled: true },
      { id: 'h9', image: img('photo-1472851294608-062f824d29cc'), title: 'A Marketplace Without Borders', subtitle: 'Trusted sellers, worldwide delivery and buyer protection on every order.', enabled: true },
      { id: 'h10', image: img('photo-1490481651871-ab68de25d43d'), title: 'Seasonal Collections, Freshly Styled', subtitle: 'Discover new arrivals from the world’s most admired brands.', enabled: true }
    ],
    promo: {
      enabled: true,
      badge: 'CIAR VIP EXCLUSIVE',
      title: 'Get 20% off your first order',
      subtitle: 'Join Ciar VIP Club and unlock exclusive member prices, early access and free shipping.',
      cta: 'Join Ciar VIP Club',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1800&q=80'
    },
    features: [
      { icon: 'truck', title: 'Free Shipping', subtitle: 'Free worldwide shipping on orders over $99' },
      { icon: 'refresh', title: 'Easy Returns', subtitle: '30-day easy returns on all items. No questions asked.' },
      { icon: 'lock', title: 'Secure Payment', subtitle: 'Your payment details are encrypted and never stored.' },
      { icon: 'headset', title: '24/7 Support', subtitle: '24/7 worldwide support' }
    ],
    testimonials: defaultTestimonials
  },

  settings: {
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
    allowCompare: true,
    maxCompare: 4,
    lowStockThreshold: 50
  },

  languages: ALL_LANGUAGES,
  currencies: ALL_CURRENCIES,

  payments: [
    { id: 'card', name: 'Credit / Debit Card', enabled: true },
    { id: 'cod', name: 'Cash on Delivery', enabled: true },
    { id: 'paypal', name: 'PayPal', enabled: true },
    { id: 'applepay', name: 'Apple Pay', enabled: true },
    { id: 'googlepay', name: 'Google Pay', enabled: true }
  ],

  shippingMethods: [
    { id: 'standard', name: 'Standard Delivery (5-8 days)', fee: 0, enabled: true, eta: '5-8 days' },
    { id: 'express', name: 'Express Delivery (2-3 days)', fee: 19.95, enabled: true, eta: '2-3 days' }
  ],

  users: [
    { id: 'u1', name: 'Alex Morgan', email: 'alex@example.com', role: 'customer', status: 'active', joined: '2024-01-15', orders: 8, spent: 1240 },
    { id: 'u2', name: 'Sofia Martinez', email: 'sofia@example.com', role: 'customer', status: 'active', joined: '2024-02-20', orders: 15, spent: 2890 },
    { id: 'u3', name: 'Omar Haddad', email: 'omar@example.com', role: 'customer', status: 'active', joined: '2024-03-05', orders: 4, spent: 560 },
    { id: 'u4', name: 'Yuki Tanaka', email: 'yuki@example.com', role: 'customer', status: 'suspended', joined: '2024-04-12', orders: 1, spent: 89 },
    { id: 'u5', name: 'James Wilson', email: 'james@example.com', role: 'seller', status: 'active', joined: '2023-11-02', orders: 62, spent: 12400 },
    { id: 'u6', name: 'Elena Petrova', email: 'elena@example.com', role: 'customer', status: 'active', joined: '2024-05-18', orders: 22, spent: 4300 }
  ],

  reviews: [
    { id: 'r1', productId: 'p1', author: 'Amira H.', rating: 5, comment: 'Excellent quality and fast delivery. Highly recommended!', date: '2026-08-01', status: 'approved' },
    { id: 'r2', productId: 'p2', author: 'Daniel K.', rating: 4, comment: 'Great phone, battery life is impressive.', date: '2026-07-28', status: 'approved' },
    { id: 'r3', productId: 'p4', author: 'Noor S.', rating: 5, comment: 'Beautiful watch, looks even better in person.', date: '2026-07-25', status: 'pending' },
    { id: 'r4', productId: 'p13', author: 'Marco P.', rating: 2, comment: 'Bag stitching came loose after a week.', date: '2026-07-20', status: 'approved' },
    { id: 'r5', productId: 'p21', author: 'Lina B.', rating: 5, comment: 'The serum transformed my skin. Worth every penny.', date: '2026-07-18', status: 'pending' },
    { id: 'r6', productId: 'p3', author: 'Hassan R.', rating: 4, comment: 'Fast laptop, great screen. Slightly heavy.', date: '2026-07-15', status: 'approved' }
  ],

  tickets: [
    { id: 't1', subject: 'Where is my order?', customer: 'Amira H.', email: 'amira@example.com', status: 'open', priority: 'high', date: '2026-08-12', messages: ['Hi, my order LM-928103 has not arrived yet. Can you help?', 'We are checking with the carrier and will update you shortly.'] },
    { id: 't2', subject: 'Return request', customer: 'Daniel K.', email: 'daniel@example.com', status: 'pending', priority: 'medium', date: '2026-08-11', messages: ['I would like to return my order and get a refund.'] },
    { id: 't3', subject: 'Seller account approval', customer: 'Elena Petrova', email: 'elena@example.com', status: 'open', priority: 'low', date: '2026-08-10', messages: ['I applied to become a seller yesterday, when will it be approved?'] },
    { id: 't4', subject: 'Payment issue', customer: 'Noor S.', email: 'noor@example.com', status: 'closed', priority: 'high', date: '2026-08-08', messages: ['My card was charged twice. Please assist.', 'We have refunded the duplicate charge. Apologies for the inconvenience.'] }
  ],

  notifications: [
    { id: 'n1', title: 'New order received', text: 'Order LM-928103 from Amira H. requires confirmation.', type: 'order', read: false, date: '2026-08-12' },
    { id: 'n2', title: 'New seller application', text: 'Elena Petrova applied to sell on the marketplace.', type: 'seller', read: false, date: '2026-08-10' },
    { id: 'n3', title: 'Low stock alert', text: 'SkyMaverick 4K Drone has only 18 units left.', type: 'stock', read: false, date: '2026-08-09' },
    { id: 'n4', title: 'New review pending', text: 'Noor S. left a review awaiting moderation.', type: 'review', read: true, date: '2026-07-25' }
  ],

  adminUsers: [
    { id: 'a1', username: 'admin', password: 'admin123', name: 'Site Administrator', role: 'superadmin' },
    { id: 'a2', username: 'manager', password: 'manager123', name: 'Store Manager', role: 'manager' }
  ],

  emailTemplates: {
    orderConfirmed: { subject: 'Order confirmed - {orderId}', body: 'Hi {name},\n\nYour order {orderId} has been confirmed and is being prepared.\n\nThank you,\nCiar VIP' },
    orderShipped: { subject: 'Your order has shipped - {orderId}', body: 'Hi {name},\n\nYour order {orderId} is on its way!\n\nTrack it at any time.\n\nCiar VIP' },
    welcome: { subject: 'Welcome to Ciar VIP!', body: 'Hi {name},\n\nWelcome aboard! Enjoy 20% off your first order.\n\nCiar VIP' }
  }
}
