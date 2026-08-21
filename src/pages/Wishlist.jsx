import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, EmptyState } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

export default function Wishlist() {
  const { t } = useTranslation()
  const { wishlist, toggleWishlist, addToCart, formatPrice } = useStore()

  return (
    <div>
      <PageHero title={t('wishlist.title')} subtitle={t('wishlist.items', { count: wishlist.length })} crumb={t('nav.wishlist')} />
      <Breadcrumb items={[{ label: t('wishlist.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft">
            <EmptyState
              icon="heart"
              title={t('wishlist.empty')}
              subtitle={t('wishlist.emptySub')}
              action={
                <Link to="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">
                  {t('wishlist.browse')}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-lift transition-all"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button onClick={() => toggleWishlist(p)} className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-red-600 shadow-soft hover:scale-110 transition-transform" aria-label={t('common.removeWishlist')}>
                    <Icon name="heart" size={16} className="fill-current" strokeWidth={0} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 mb-1">{getBrand(p.brand).name}</p>
                  <Link to={`/product/${p.id}`} className="text-sm font-semibold text-midnight-900 line-clamp-2 hover:text-brand-600 transition-colors mb-2">{p.name}</Link>
                  <div className="flex items-center gap-1.5 mb-3">
                    <StarRating rating={p.rating} size={13} />
                    <span className="text-xs text-slate-400">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-midnight-900">{formatPrice(p.price)}</span>
                      {p.originalPrice && <span className="text-xs text-slate-400 line-through">{formatPrice(p.originalPrice)}</span>}
                    </div>
                    <button onClick={() => addToCart(p)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-midnight-900 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
                      <Icon name="cart" size={14} />
                      {t('wishlist.moveToCart')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
