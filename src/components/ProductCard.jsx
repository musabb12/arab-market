import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand, getCategory, discountPercent } from '../utils/helpers.js'
import Icon from './Icons.jsx'
import StarRating from './StarRating.jsx'

const badgeStyles = {
  bestSeller: 'bg-slate-900 text-white',
  newArrival: 'bg-emerald-600 text-white',
  flashSale: 'bg-red-600 text-white',
  featured: 'bg-brand-600 text-white',
  deal: 'bg-amber-500 text-white',
  topRated: 'bg-sky-600 text-white',
  luxury: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
}

const badgeKeys = {
  bestSeller: 'common.bestSeller',
  newArrival: 'common.newArrival',
  flashSale: 'common.flashSale',
  featured: 'common.featured',
  deal: 'common.hot',
  topRated: 'common.topRated',
  luxury: 'common.limited'
}

export default function ProductCard({ product, index = 0 }) {
  const { t } = useTranslation()
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, formatPrice } = useStore()
  const brand = getBrand(product.brand)
  const category = getCategory(product.category)
  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const discount = discountPercent(product.price, product.originalPrice)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badges?.map((b) => (
            <span key={b} className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeStyles[b] || badgeStyles.featured}`}>
              {t(badgeKeys[b] || 'common.featured')}
            </span>
          ))}
        </div>
        {discount > 0 && (
          <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded-full">
            {t('common.discount', { percent: discount })}
          </span>
        )}
        {product.sellerId === 's3' && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[10px] font-semibold px-2 py-1 rounded-full">Made in Italy</span>
        )}
      </Link>

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          className={`p-2 rounded-full shadow-soft transition-colors ${inWishlist ? 'bg-red-600 text-white' : 'bg-white/95 text-slate-700 hover:text-red-600'}`}
          aria-label={t('common.wishlist')}
        >
          <Icon name="heart" size={16} className={inWishlist ? 'fill-current' : ''} strokeWidth={inWishlist ? 0 : 1.8} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleCompare(product)
          }}
          className={`p-2 rounded-full shadow-soft transition-colors ${inCompare ? 'bg-brand-600 text-white' : 'bg-white/95 text-slate-700 hover:text-brand-600'}`}
          aria-label={t('compare.title')}
        >
          <Icon name="compare" size={16} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{brand.name}</span>
          <span className="text-[11px] text-slate-400">{category.nameKey ? t(category.nameKey) : category.name}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-midnight-900 line-clamp-2 mb-1.5 hover:text-brand-600 transition-colors leading-snug">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} size={13} />
          <span className="text-xs text-slate-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-midnight-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-full bg-midnight-900 text-white hover:bg-brand-600 transition-colors shadow-soft"
            aria-label={t('common.addToCart')}
          >
            <Icon name="cart" size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
