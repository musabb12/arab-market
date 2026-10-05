import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getBrand, getCategory, discountPercent } from '../utils/helpers.js'
import { Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, formatPrice, products, sellers, settings } = useStore()
  const product = products.find((p) => p.id === id)
  const [mainImage, setMainImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [recent, setRecent] = useState([])

  useEffect(() => {
    setMainImage(0)
    setQty(1)
    setTab('desc')
    if (product) {
      const rv = JSON.parse(localStorage.getItem('lumina_recent') || '[]')
      const next = [product.id, ...rv.filter((x) => x !== product.id)].slice(0, 8)
      localStorage.setItem('lumina_recent', JSON.stringify(next))
    }
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const rv = JSON.parse(localStorage.getItem('lumina_recent') || '[]')
    setRecent(products.filter((p) => rv.includes(p.id) && p.id !== id).slice(0, 4))
  }, [id])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900 mb-4">{t('notFound.title')}</h2>
        <Link to="/products" className="text-brand-600 font-semibold hover:underline">{t('notFound.home')}</Link>
      </div>
    )
  }

  const brand = getBrand(product.brand)
  const category = getCategory(product.category)
  const seller = sellers.find((s) => s.id === product.sellerId) || sellers[0]
  const inWishlist = isInWishlist(product.id)
  const inCompare = isInCompare(product.id)
  const discount = discountPercent(product.price, product.originalPrice)
  const images = product.images || [product.image]

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div>
      <Breadcrumb
        items={[
          { to: `/category/${category.id}`, label: t(category.nameKey) },
          { to: `/brand/${brand.id}`, label: brand.name },
          { label: product.name }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="flex gap-4">
            <div className="hidden sm:flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === mainImage ? 'border-brand-500' : 'border-transparent hover:border-slate-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div key={mainImage} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="flex-1 relative rounded-3xl overflow-hidden bg-slate-100 aspect-square">
              <img src={images[mainImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.badges?.includes('flashSale') && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {t('common.discount', { percent: discount })}
                </span>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link to={`/brand/${brand.id}`} className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:underline">{brand.name}</Link>
              <span className="text-slate-300">|</span>
              <Link to={`/category/${category.id}`} className="text-xs text-slate-500 hover:text-brand-600 transition-colors">{t(category.nameKey)}</Link>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm font-semibold text-midnight-900">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviews.toLocaleString()} {t('common.reviews', { count: product.reviews })})</span>
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-bold text-midnight-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-slate-500 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className={`flex items-center gap-1.5 text-sm font-medium ${product.stock > settings.lowStockThreshold ? 'text-emerald-600' : 'text-amber-600'}`}>
                <span className={`h-2 w-2 rounded-full ${product.stock > settings.lowStockThreshold ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {product.stock > settings.lowStockThreshold ? t('common.inStock') : t('common.lowStock', { count: product.stock })}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">{t('orders.statusShipped')} · {t('common.freeShipping')}</span>
            </div>

            {product.colors && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-midnight-900 mb-2">{t('common.category')} color</p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button key={c} className="h-9 w-9 rounded-full border-2 border-white shadow ring-1 ring-slate-200 hover:ring-brand-400 transition-all" style={{ backgroundColor: c }} aria-label="Color" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-slate-200 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-slate-500 hover:text-midnight-900" aria-label="Decrease">
                  <Icon name="minus" size={16} />
                </button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-3 text-slate-500 hover:text-midnight-900" aria-label="Increase">
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 min-w-[180px] px-8 py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Icon name="cart" size={18} />
                {t('common.addToCart')}
              </button>
              <button
                onClick={() => { addToCart(product, qty); navigate('/checkout') }}
                className="px-8 py-4 rounded-full bg-midnight-900 text-white font-semibold hover:bg-brand-600 transition-colors"
              >
                {t('common.buyNow')}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${inWishlist ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600'}`}
              >
                <Icon name="heart" size={16} className={inWishlist ? 'fill-current' : ''} />
                {inWishlist ? t('common.removeWishlist') : t('common.wishlist')}
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${inCompare ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'}`}
              >
                <Icon name="compare" size={16} />
                {t('compare.title')}
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-400 transition-colors"
              >
                <Icon name="share" size={16} />
                {t('common.copy')}
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: 'truck', label: t('products.deliveryTitle'), sub: t('products.deliveryText') },
                { icon: 'refresh', label: t('common.returns'), sub: t('products.returnPolicy') },
                { icon: 'shield', label: t('products.specifications'), sub: t('products.guarantee') }
              ].map((f) => (
                <div key={f.icon} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <Icon name={f.icon} size={20} className="text-brand-600 mb-2" />
                  <p className="text-sm font-semibold text-midnight-900 mb-1">{f.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seller card */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <Link to={`/store/${seller.id}`} className="flex flex-wrap items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <img src={seller.image} alt={seller.name} className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <p className="flex items-center gap-2 font-semibold text-midnight-900 group-hover:text-brand-600 transition-colors">
                  {seller.name}
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Icon name="check" size={10} />
                    {t('store.verified')}
                  </span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><StarRating rating={seller.rating} size={11} /> {seller.rating}</span>
                  <span>{seller.followers.toLocaleString()} {t('store.followers')}</span>
                  <span>{t('store.response')}: {seller.response}</span>
                </div>
              </div>
            </div>
            <span className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-colors">
              {t('store.title')}
            </span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { key: 'desc', label: t('products.description') },
              { key: 'specs', label: t('products.specifications') },
              { key: 'reviews', label: t('products.reviewsTitle') }
            ].map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === tb.key ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-midnight-900'}`}
              >
                {tb.label}
              </button>
            ))}
          </div>
          <div className="p-7">
            {tab === 'desc' && <p className="text-slate-600 leading-relaxed max-w-3xl">{product.description}</p>}
            {tab === 'specs' && (
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {product.specs.map((s) => (
                  <div key={s} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <Icon name="check" size={13} />
                    </span>
                    <span className="text-sm text-midnight-900">{s}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div className="max-w-3xl">
                {[product.rating, Math.max(4, product.rating - 0.4), Math.max(3.8, product.rating - 0.8)].map((r, i) => (
                  <div key={i} className="border-b border-slate-50 py-5 first:pt-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-9 w-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                        {['A', 'M', 'S'][i]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-midnight-900">{['Alexandra M.', 'David L.', 'Sarah K.'][i]}</p>
                        <StarRating rating={r} size={12} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {i === 0 && 'Absolutely beautiful product. Quality is outstanding and it arrived perfectly packaged. Highly recommended!'}
                      {i === 1 && 'Very pleased with the purchase. Exactly as described and the quality exceeds the price. Fast shipping too.'}
                      {i === 2 && 'Great value for money. The customer service was responsive when I had a question about delivery.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        <div className="mt-14">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 mb-6">{t('products.similarProducts')}</h2>
          <ProductGrid products={similar} cols={4} />
        </div>

        {/* Recently viewed */}
        {recent.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 mb-6">{t('common.recentlyViewed')}</h2>
            <ProductGrid products={recent} cols={4} />
          </div>
        )}
      </div>
    </div>
  )
}
