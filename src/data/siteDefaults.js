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

export const CATALOG_VERSION = 'luxury-4'

export const HEADER_FONTS = [
  { id: 'default', label: 'Default', family: null },
  { id: 'reem', label: 'Reem Kufi', family: "'Reem Kufi', 'Alexandria', sans-serif" },
  { id: 'cairo', label: 'Cairo', family: "'Cairo', 'Alexandria', sans-serif" },
  { id: 'tajawal', label: 'Tajawal', family: "'Tajawal', 'Alexandria', sans-serif" },
  { id: 'changa', label: 'Changa', family: "'Changa', 'Alexandria', sans-serif" },
  { id: 'almarai', label: 'Almarai', family: "'Almarai', 'Alexandria', sans-serif" },
  { id: 'alexandria', label: 'Alexandria', family: "'Alexandria', sans-serif" },
  { id: 'cormorant', label: 'Cormorant Garamond', family: "'Cormorant Garamond', Georgia, serif" },
  { id: 'manrope', label: 'Manrope', family: "'Manrope', 'Alexandria', sans-serif" }
]

export function headerFontFamily(id) {
  return HEADER_FONTS.find((f) => f.id === id)?.family || null
}

export const TEXT_SIZES = [
  { id: 'default', label: 'Default', value: null },
  { id: 'sm', label: 'Small', value: '0.82rem' },
  { id: 'md', label: 'Medium', value: '0.95rem' },
  { id: 'lg', label: 'Large', value: '1.1rem' },
  { id: 'xl', label: 'X-Large', value: '1.3rem' }
]

export function textSizeValue(id) {
  return TEXT_SIZES.find((s) => s.id === id)?.value || null
}

export const INFO_PAGES = ['privacy', 'terms', 'returns', 'shipping', 'cookies']

export const AD_POSITIONS = ['homeTop', 'homeMiddle', 'homeBottom', 'popup']

export const defaultSiteData = {
  catalogVersion: CATALOG_VERSION,
  products: defaultProducts.map((p) => ({ ...p, active: true, stockBase: p.stock })),
  categories: defaultCategories,
  brands: defaultBrands,
  sellers: defaultSellers.map((s) => ({ ...s, status: 'approved', earnings: 486000, approved: true, commissionRate: 8 })),
  coupons: defaultCoupons.map((c, i) => ({ id: `cp${i + 1}`, status: 'active', used: 0, limit: 100, ...c })),

  content: {
    announcement: 'Free worldwide shipping on orders over $99',
    heroSlides: [
      { id: 'lx1', image: img('photo-1441986300917-64674bd600d8'), title: 'The World’s Rarest Maisons, One Address', subtitle: 'Hermès, Patek Philippe, Graff and more — guaranteed authentic, delivered with white gloves.', enabled: true },
      { id: 'lx2', image: img('photo-1591561954557-26941169b49e'), title: 'Iconic Handbags, Timeless Investments', subtitle: 'Birkin, Kelly and Constance in pristine condition with full sets.', enabled: true },
      { id: 'lx3', image: img('photo-1587836374828-4dbafa94cf0e'), title: 'The Art of Haute Horlogerie', subtitle: 'Patek Philippe, Rolex, IWC — waitlist icons, available now.', enabled: true },
      { id: 'lx4', image: img('photo-1573408301185-9146fe634ad0'), title: 'High Jewelry Worthy of Heritage', subtitle: 'Certified diamonds and rare gems from Cartier, Graff and Harry Winston.', enabled: true },
      { id: 'lx5', image: img('photo-1595777457583-95e059d581b8'), title: 'Haute Couture for Unforgettable Evenings', subtitle: 'Valentino, Elie Saab, Zuhair Murad — evening gowns made to measure.', enabled: true },
      { id: 'lx6', image: img('photo-1592945403244-b3fbafd7f539'), title: 'Niche Perfumes & Precious Oud', subtitle: 'Clive Christian, Roja, Amouage — scents worn by the very few.', enabled: true },
      { id: 'lx7', image: img('photo-1555041469-a586c61ea9bc'), title: 'Residences Dressed in Luxury', subtitle: 'Fendi Casa, Baccarat, Lalique — furniture and crystal for exceptional homes.', enabled: true },
      { id: 'lx8', image: img('photo-1567899378494-47b22a2ae96a'), title: 'The Art of Living Well', subtitle: 'Riva yachts, Honma golf, Hermès equestrian — passions of the elite.', enabled: true }
    ],
    promo: {
      enabled: true,
      badge: 'CIAR VIP EXCLUSIVE',
      title: 'Get 20% off your first order',
      subtitle: 'Join Ciar VIP Club and unlock exclusive member prices, early access and free shipping.',
      cta: 'Join Ciar VIP Club',
      image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1800&q=80'
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
    defaultLanguage: 'ar',
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
    requireLogin: true,
    allowCompare: true,
    maxCompare: 4,
    lowStockThreshold: 50,
    phone: '+966 11 234 5678',
    whatsapp: '+966501234567',
    email: 'hello@ciarvip.com',
    facebook: 'https://facebook.com/ciarvip',
    instagram: 'https://instagram.com/ciarvip',
    twitter: 'https://x.com/ciarvip',
    tiktok: 'https://tiktok.com/@ciarvip',
    youtube: 'https://youtube.com/@ciarvip',
    linkedin: 'https://linkedin.com/company/ciarvip',
    snapchat: 'https://www.snapchat.com/add/ciarvip',
    telegram: 'https://t.me/ciarvip',
    pinterest: 'https://pinterest.com/ciarvip',
    threads: 'https://www.threads.net/@ciarvip',
    discord: 'https://discord.gg/ciarvip',
    whatsappMessage: 'Hello! I need help with my order.',
    whatsappFloat: true,
    socialEnabled: {
      whatsapp: true,
      instagram: true,
      facebook: true,
      twitter: true,
      tiktok: true,
      youtube: true,
      linkedin: true,
      snapchat: true,
      telegram: true,
      pinterest: true,
      threads: true,
      discord: true
    }
  },

  header: {
    topBarEnabled: true,
    topBarMessages: [],
    topBarBg: '',
    topBarColor: '',
    topBarBgImage: '',
    barBg: '',
    barBgImage: '',
    barBgImages: [],
    logoFont: 'default',
    logoSize: null,
    showSearch: true,
    showNavStrip: true,
    showCategoriesMenu: true,
    showTrackOrder: true,
    showThemeToggle: true,
    customLinks: []
  },

  ads: [],

  fitting: {
    enabled: true,
    navLink: true,
    showPhoto: true,
    showMeasurements: true,
    showPreferences: true,
    resultsCount: 8,
    minScore: 25,
    budgetMax: 50000,
    weights: { category: 30, segment: 10, color: 25, size: 15, budget: 15, rating: 5, fit: 5 }
  },

  ai: {
    enabled: true,
    name: 'Ciar Assistant',
    welcome: 'Hello! I am your Ciar VIP shopping assistant. Ask me about products, orders, shipping or anything else.',
    suggestions: ['Today\u2019s deals', 'Track my order', 'Help me find a gift'],
    whatsappFallback: true,
    faqs: [
      { id: 'f1', q: 'shipping delivery', a: 'Standard delivery takes 5-8 business days and is free over $99. Express delivery arrives in 2-3 days.' },
      { id: 'f2', q: 'return refund', a: 'You can return most items within 30 days of delivery for a full refund. Start the return from your account page.' },
      { id: 'f3', q: 'payment methods', a: 'We accept credit cards, PayPal, Apple Pay, Google Pay, Whish Money and cash on delivery where available.' }
    ]
  },

  pages: {},

  languages: ALL_LANGUAGES,
  currencies: ALL_CURRENCIES,

  payments: [
    { id: 'card', name: 'Credit / Debit Card', enabled: true },
    { id: 'ciarprepaid', name: 'Ciar Prepaid Mastercard', enabled: true },
    { id: 'whish', name: 'Whish Money', enabled: true },
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
    { id: 'r1', productId: 'p1', author: 'Amira H.', rating: 5, comment: 'The gown fits like a dream. Couture service was impeccable.', date: '2026-08-01', status: 'approved' },
    { id: 'r2', productId: 'p14', author: 'Sara A.', rating: 5, comment: 'Birkin arrived with the full set and receipt. Flawless.', date: '2026-07-28', status: 'approved' },
    { id: 'r3', productId: 'p25', author: 'Khalid M.', rating: 5, comment: 'Finally found my Calatrava. Authentic and beautifully presented.', date: '2026-07-25', status: 'pending' },
    { id: 'r4', productId: 'p33', author: 'Noura S.', rating: 5, comment: 'My Love bracelet came with its certificate and screwdriver.', date: '2026-07-20', status: 'approved' },
    { id: 'r5', productId: 'p50', author: 'Lina B.', rating: 5, comment: 'Baccarat Rouge extrait lasts all day. Pure luxury.', date: '2026-07-18', status: 'pending' },
    { id: 'r6', productId: 'p7', author: 'Hassan R.', rating: 4, comment: 'Superb tailoring, the fitting appointment was a nice touch.', date: '2026-07-15', status: 'approved' }
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
    { id: 'n3', title: 'Low stock alert', text: 'Patek Philippe Calatrava 6119R has only 1 piece left.', type: 'stock', read: false, date: '2026-08-09' },
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
