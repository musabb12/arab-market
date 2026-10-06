import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand, discountPercent } from '../utils/helpers.js'
import Icon from './Icons.jsx'

const badgeStyles = {
  rare: 'bg-midnight-950 text-amber-300',
  newArrival: 'bg-white text-midnight-900',
  bestSeller: 'bg-amber-500 text-white',
  luxury: 'bg-white/95 text-amber-700'
}

const badgeKeys = {
  rare: 'common.rare',
  newArrival: 'common.newArrival',
  bestSeller: 'common.bestSeller',
  luxury: 'common.limited'
}

const BADGE_PRIORITY = ['rare', 'newArrival', 'bestSeller', 'luxury']

export default function ProductCard({ product, index = 0 }) {
  const { t } = useTranslation()
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, formatPrice } = useStore()
  const brand = getBrand(product.brand)
  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const discount = discountPercent(product.price, product.originalPrice)
  const hoverImage = (product.images || []).find((src) => src && src !== product.image)
  const badge = BADGE_PRIORITY.find((b) => product.badges?.includes(b))

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: (index % 5) * 0.04 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 dark:bg-midnight-800">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-2 start-2 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className="rounded-md bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white" dir="ltr">-{discount}%</span>
          )}
          {badge && (
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide shadow-sm ${badgeStyles[badge]}`}>
              {t(badgeKeys[badge])}
            </span>
          )}
        </div>

        <div className="absolute top-2 end-2 flex flex-col gap-1.5">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${inWishlist ? 'bg-red-600 text-white' : 'bg-white/95 text-midnight-900 hover:text-red-600'}`}
            aria-label={t('common.wishlist')}
          >
            <Icon name="heart" size={15} className={inWishlist ? 'fill-current' : ''} strokeWidth={inWishlist ? 0 : 1.8} />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={`hidden md:flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 ${inCompare ? 'bg-brand-600 text-white opacity-100' : 'bg-white/95 text-midnight-900 hover:text-brand-600'}`}
            aria-label={t('compare.title')}
          >
            <Icon name="compare" size={15} />
          </button>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-2 bottom-2 hidden md:flex items-center justify-center gap-2 rounded-lg bg-midnight-950/90 py-2 text-xs font-semibold text-white backdrop-blur-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-brand-600"
        >
          <Icon name="cart" size={14} />
          {t('common.addToCart')}
        </button>
      </div>

      <div className="pt-2.5 px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 truncate" dir="ltr">{brand.name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-0.5 text-[13px] text-midnight-900 dark:text-slate-100 truncate hover:text-brand-600 transition-colors" dir="auto">{product.name}</h3>
        </Link>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className={`text-[15px] font-extrabold ${discount > 0 ? 'text-red-600' : 'text-midnight-900 dark:text-white'}`}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through truncate">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-midnight-900 dark:border-white/30 text-midnight-900 dark:text-white"
            aria-label={t('common.addToCart')}
          >
            <Icon name="cart" size={14} />
          </button>
        </div>
        {product.rating > 0 && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
            <Icon name="star" size={11} className="fill-amber-400 text-amber-400" strokeWidth={0} />
            <span className="font-semibold text-slate-600 dark:text-slate-300">{product.rating.toFixed(1)}</span>
            <span>({(product.reviews || 0).toLocaleString()})</span>
          </p>
        )}
      </div>
    </motion.div>
  )
}
