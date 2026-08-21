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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {children}
    </div>
  )
}

export function PageHero({ title, subtitle, crumb, image }) {
  return (
    <div className="relative overflow-hidden bg-midnight-900">
      <div className="absolute inset-0 bg-hero-mesh opacity-60" />
      <div
        className="absolute inset-0 opacity-10"
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      />
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {crumb && (
            <nav className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4">
              <Link to="/" className="hover:text-white transition-colors">{tHome()}</Link>
              <Icon name="chevronRight" size={12} />
              <span className="text-slate-200">{crumb}</span>
            </nav>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">{title}</h1>
          {subtitle && <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
    </div>
  )
}

function tHome() {
  const { t } = useTranslation()
  return t('common.breadcrumbHome')
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
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  }
  return (
    <div className={`grid ${colClass[cols] || colClass[4]} gap-5`}>
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 text-brand-600 border border-brand-100">
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
        className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6"
      >
        <Icon name={icon} size={40} className="text-slate-300" />
      </motion.span>
      <h3 className="text-lg font-bold text-midnight-900 mb-1.5">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 max-w-sm mb-6">{subtitle}</p>}
      {action}
    </div>
  )
}
