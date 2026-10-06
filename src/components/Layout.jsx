import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ProductCard from './ProductCard.jsx'
import SectionHeader from './SectionHeader.jsx'
import Icon from './Icons.jsx'

export { SectionHeader }

export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return null
}

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-midnight-950">
      {children}
    </div>
  )
}

export const PAGE_HERO_IMAGES = {
  deals: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=1600&q=80',
  products: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1600&q=80',
  brands: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80',
  gifts: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1600&q=80',
  new: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  bestsellers: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  cart: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
  checkout: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=80',
  account: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  wishlist: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
  sell: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80',
  about: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80',
  contact: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1600&q=80',
  help: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80',
  search: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80',
  track: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1600&q=80',
  coupons: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=80',
  compare: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1600&q=80',
  store: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80',
  info: 'https://images.unsplash.com/photo-1450101499163-c8848c509772?auto=format&fit=crop&w=1600&q=80',
  default: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1600&q=80'
}

export function PageHero({ title, subtitle, crumb, image, theme = 'default' }) {
  const { t } = useTranslation()
  const bg = image || PAGE_HERO_IMAGES[theme] || PAGE_HERO_IMAGES.default

  return (
    <div className="relative overflow-hidden -mt-[var(--site-nav-h)] min-h-[calc(var(--site-nav-h)+240px)] md:min-h-[calc(var(--site-nav-h)+280px)] flex items-end">
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(10,33,64,0.48) 0%, rgba(28,58,102,0.32) 48%, rgba(12,40,72,0.44) 100%)'
        }}
      />
      <div className="relative w-full pt-[var(--site-nav-h)]">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 w-full text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {crumb && (
              <nav className="flex items-center justify-center gap-2 text-xs text-white/75 mb-3">
                <Link to="/" className="hover:text-white transition-colors">{t('common.breadcrumbHome')}</Link>
                <Icon name="chevronRight" size={12} />
                <span className="text-white">{crumb}</span>
              </nav>
            )}
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-white mb-2 [text-shadow:0_2px_10px_rgba(8,24,48,0.45)]">{title}</h1>
            {subtitle && <p className="text-slate-100 max-w-2xl mx-auto leading-relaxed [text-shadow:0_2px_8px_rgba(8,24,48,0.35)]">{subtitle}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function Breadcrumb({ items }) {
  const { t } = useTranslation()
  return (
    <nav className="max-w-7xl mx-auto px-4 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <li>
          <Link to="/" className="hover:text-brand-600 transition-colors">{t('common.breadcrumbHome')}</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Icon name="chevronRight" size={12} className="text-slate-300" />
            {item.to ? (
              <Link to={item.to} className="hover:text-brand-600 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-midnight-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function ProductGrid({ products, cols = 4 }) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }
  return (
    <div className={`grid ${colClass[cols] || colClass[4]} gap-x-3 gap-y-7 md:gap-x-4 md:gap-y-9`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  )
}

export function FeatureBar() {
  const { t } = useTranslation()
  const features = [
    { icon: 'truck', title: t('common.freeShipping'), sub: t('topBar.ship') },
    { icon: 'refresh', title: t('common.returns'), sub: t('products.returnPolicy') },
    { icon: 'lock', title: t('common.securePayment'), sub: t('checkout.secureNotice') },
    { icon: 'headset', title: t('common.support'), sub: t('contact.hoursValue') }
  ]
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-start gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <Icon name={f.icon} size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-midnight-900">{f.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{f.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 mb-6"
      >
        <Icon name={icon} size={40} className="text-slate-300" />
      </motion.span>
      <h3 className="text-lg font-bold text-midnight-900 mb-1.5">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 max-w-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  )
}
