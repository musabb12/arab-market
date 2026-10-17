import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getBrand, getCategory, discountPercent, sellerLabel } from '../utils/helpers.js'
import { enrichProductDetails } from '../utils/productDetails.js'
import { Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

const MEASURE_LABELS = {
  length: 'products.measureLength',
  bust: 'products.measureBust',
  waist: 'products.measureWaist',
  hips: 'products.measureHips',
  chest: 'products.measureChest',
  sleeve: 'products.measureSleeve',
  shoulder: 'products.measureShoulder',
  heel: 'products.measureHeel',
  width: 'products.measureWidth',
  depth: 'products.measureDepth',
  strap: 'products.measureStrap',
  thickness: 'products.measureThickness',
  volume: 'products.measureVolume',
  dimensions: 'products.measureDimensions',
  netWeight: 'products.measureWeight'
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare, formatPrice, products, sellers, settings } = useStore()
  const raw = products.find((p) => p.id === id)
  const product = useMemo(() => (raw ? enrichProductDetails(raw) : null), [raw])
  const [colorId, setColorId] = useState(null)
  const [size, setSize] = useState(null)
  const [mainImage, setMainImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const [recent, setRecent] = useState([])

  useEffect(() => {
    if (!product) return
    const firstColor = product.colorVariants[0]
    setColorId(firstColor?.id || null)
    setSize(product.sizes?.[0] || null)
    setMainImage(0)
    setQty(1)
    setTab('desc')
    const rv = JSON.parse(localStorage.getItem('lumina_recent') || '[]')
    const next = [product.id, ...rv.filter((x) => x !== product.id)].slice(0, 8)
    localStorage.setItem('lumina_recent', JSON.stringify(next))
    window.scrollTo(0, 0)
  }, [id, product?.id])

  useEffect(() => {
    const rv = JSON.parse(localStorage.getItem('lumina_recent') || '[]')
    setRecent(products.filter((p) => rv.includes(p.id) && p.id !== id).slice(0, 4))
  }, [id, products])

  const selectedColor = product?.colorVariants?.find((c) => c.id === colorId) || product?.colorVariants?.[0]
  const images = selectedColor?.images?.length ? selectedColor.images : product?.images || [product?.image]

  useEffect(() => {
    setMainImage(0)
  }, [colorId])

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
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const lowStock = product.stock <= (settings.lowStockThreshold || 50)
  const measureEntries = Object.entries(product.measurements || {})

  const add = () => addToCart({ ...product, selectedSize: size, selectedColor: selectedColor?.name }, qty)

  return (
    <div>
      <Breadcrumb
        items={[
          { to: `/category/${category.id}`, label: t(category.nameKey) },
          { to: `/brand/${brand.id}`, label: t(`brands.${brand.id}`, { defaultValue: brand.name }) },
          { label: product.name }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery — updates with selected color */}
          <div className="flex gap-4">
            <div className="hidden sm:flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={`${colorId}-${i}`}
                  onClick={() => setMainImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === mainImage ? 'border-brand-500' : 'border-transparent hover:border-slate-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div key={`${colorId}-${mainImage}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="flex-1 relative rounded-3xl overflow-hidden bg-slate-100 aspect-square">
              <img src={images[mainImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.badges?.includes('flashSale') && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {t('common.discount', { percent: discount })}
                </span>
              )}
              {selectedColor && (
                <span className="absolute bottom-4 start-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-midnight-900 shadow">
                  {selectedColor.name}
                </span>
              )}
            </motion.div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link to={`/brand/${brand.id}`} className="text-xs font-bold tracking-wide text-brand-600 hover:underline">{t(`brands.${brand.id}`, { defaultValue: brand.name })}</Link>
              <span className="text-slate-300">|</span>
              <Link to={`/category/${category.id}`} className="text-xs text-slate-500 hover:text-brand-600 transition-colors">{t(category.nameKey)}</Link>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 dark:text-white mb-3" dir="auto">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm font-semibold text-midnight-900 dark:text-white">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviews.toLocaleString()} {t('common.reviews', { count: product.reviews })})</span>
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-3xl font-bold text-midnight-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="px-2.5 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-slate-500 leading-relaxed mb-5" dir="auto">{product.description}</p>

            {/* Stock */}
            <div className={`mb-5 rounded-2xl border px-4 py-3 flex items-center justify-between ${lowStock ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20' : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20'}`}>
              <span className={`flex items-center gap-2 text-sm font-semibold ${lowStock ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${lowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {product.stock > 0 ? t('products.stockLeft', { count: product.stock }) : t('common.outOfStock')}
              </span>
              <span className="text-xs text-slate-500">{t('common.freeShipping')}</span>
            </div>

            {/* Fabric */}
            <div className="mb-5 rounded-2xl bg-slate-50 dark:bg-midnight-900 border border-slate-100 dark:border-white/10 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t('products.fabric')}</p>
              <p className="text-sm font-semibold text-midnight-900 dark:text-white" dir="auto">{product.fabric}</p>
            </div>

            {/* Colors with photos */}
            {product.colorVariants?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-midnight-900 dark:text-white mb-2">
                  {t('products.colors')}
                  {selectedColor && <span className="ms-2 text-slate-500 font-normal">· {selectedColor.name}</span>}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colorVariants.map((c) => {
                    const active = c.id === selectedColor?.id
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColorId(c.id)}
                        className={`group flex flex-col items-center gap-1.5 ${active ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                        aria-label={c.name}
                      >
                        <span className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${active ? 'border-brand-600 ring-2 ring-brand-200' : 'border-slate-200 dark:border-white/15'}`}>
                          <img src={c.images[0]} alt={c.name} className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 end-1 h-3.5 w-3.5 rounded-full border border-white shadow" style={{ backgroundColor: c.hex }} />
                        </span>
                        <span className={`text-[11px] font-medium ${active ? 'text-brand-600' : 'text-slate-500'}`}>{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-midnight-900 dark:text-white mb-2">{t('products.availableSizes')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const active = size === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`min-w-[3rem] px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                          active
                            ? 'border-midnight-900 bg-midnight-900 text-white dark:border-white dark:bg-white dark:text-midnight-950'
                            : 'border-slate-200 dark:border-white/15 text-midnight-900 dark:text-white hover:border-brand-400'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Measurements */}
            {measureEntries.length > 0 && (
              <div className="mb-6 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                <div className="bg-slate-50 dark:bg-midnight-900 px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
                  <p className="text-sm font-semibold text-midnight-900 dark:text-white">{t('products.measurements')}</p>
                </div>
                <dl className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-white/10">
                  {measureEntries.map(([key, value]) => (
                    <div key={key} className="bg-white dark:bg-midnight-950 px-4 py-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        {t(MEASURE_LABELS[key] || 'products.measureDimensions', { defaultValue: key })}
                      </dt>
                      <dd className="text-sm font-semibold text-midnight-900 dark:text-white" dir="auto">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-slate-200 dark:border-white/15 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-slate-500 hover:text-midnight-900" aria-label="Decrease">
                  <Icon name="minus" size={16} />
                </button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-3 text-slate-500 hover:text-midnight-900" aria-label="Increase">
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button
                onClick={add}
                disabled={product.stock <= 0}
                className="flex-1 min-w-[180px] px-8 py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Icon name="cart" size={18} />
                {t('common.addToCart')}
              </button>
              <button
                onClick={() => { add(); navigate('/checkout') }}
                disabled={product.stock <= 0}
                className="px-8 py-4 rounded-full bg-midnight-900 text-white font-semibold hover:bg-brand-600 transition-colors disabled:opacity-50"
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
                <div key={f.icon} className="bg-slate-50 dark:bg-midnight-900 border border-slate-100 dark:border-white/10 rounded-2xl p-4">
                  <Icon name={f.icon} size={20} className="text-brand-600 mb-2" />
                  <p className="text-sm font-semibold text-midnight-900 dark:text-white mb-1">{f.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seller card */}
        <div className="mt-10 bg-white dark:bg-midnight-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-soft p-6">
          <Link to={`/store/${seller.id}`} className="flex flex-wrap items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <img src={seller.image} alt={sellerLabel(seller, t)} className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <p className="flex items-center gap-2 font-semibold text-midnight-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {sellerLabel(seller, t)}
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
            <span className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/15 text-sm font-semibold text-midnight-900 dark:text-white hover:border-brand-400 hover:text-brand-600 transition-colors">
              {t('store.title')}
            </span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mt-10 bg-white dark:bg-midnight-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-soft overflow-hidden">
          <div className="flex border-b border-slate-100 dark:border-white/10 overflow-x-auto no-scrollbar">
            {[
              { key: 'desc', label: t('products.description') },
              { key: 'specs', label: t('products.specifications') },
              { key: 'details', label: t('products.fullDetails') },
              { key: 'reviews', label: t('products.reviewsTitle') }
            ].map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`shrink-0 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === tb.key ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-midnight-900'}`}
              >
                {tb.label}
              </button>
            ))}
          </div>
          <div className="p-7">
            {tab === 'desc' && <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl" dir="auto">{product.description}</p>}
            {tab === 'specs' && (
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {(product.specs || []).map((s) => (
                  <div key={s} className="flex items-center gap-3 bg-slate-50 dark:bg-midnight-950 rounded-xl px-4 py-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <Icon name="check" size={13} />
                    </span>
                    <span className="text-sm text-midnight-900 dark:text-white" dir="auto">{s}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'details' && (
              <div className="max-w-2xl space-y-3">
                {[
                  [t('products.fabric'), product.fabric],
                  [t('products.availableSizes'), (product.sizes || []).join(' · ')],
                  [t('products.colors'), product.colorVariants.map((c) => c.name).join(' · ')],
                  [t('products.stockLeft', { count: product.stock }), String(product.stock)],
                  ...measureEntries.map(([k, v]) => [t(MEASURE_LABELS[k] || 'products.measureDimensions', { defaultValue: k }), v])
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-3">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-midnight-900 dark:text-white text-end" dir="auto">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'reviews' && (
              <div className="max-w-3xl">
                {[product.rating, Math.max(4, product.rating - 0.4), Math.max(3.8, product.rating - 0.8)].map((r, i) => (
                  <div key={i} className="border-b border-slate-50 dark:border-white/5 py-5 first:pt-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-9 w-9 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                        {['A', 'M', 'S'][i]}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-midnight-900 dark:text-white">{['Alexandra M.', 'David L.', 'Sarah K.'][i]}</p>
                        <StarRating rating={r} size={12} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {i === 0 && t('products.reviewSample1')}
                      {i === 1 && t('products.reviewSample2')}
                      {i === 2 && t('products.reviewSample3')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 dark:text-white mb-6">{t('products.similarProducts')}</h2>
          <ProductGrid products={similar} cols={4} />
        </div>

        {recent.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-midnight-900 dark:text-white mb-6">{t('common.recentlyViewed')}</h2>
            <ProductGrid products={recent} cols={4} />
          </div>
        )}
      </div>
    </div>
  )
}
