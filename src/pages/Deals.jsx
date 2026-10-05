import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Breadcrumb, ProductGrid, FeatureBar } from '../components/Layout.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import { discountPercent, getBrand } from '../utils/helpers.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80'
]

function SideDealCard({ product, formatPrice, index }) {
  const discount = discountPercent(product.price, product.originalPrice)
  const brand = getBrand(product.brand)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.07 }}
      className="min-w-0"
    >
      <Link
        to={`/product/${product.id}`}
        className="group flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:border-white/10 dark:bg-midnight-900"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-midnight-800">
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute start-1.5 top-1.5 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
          <p className="mb-0.5 truncate text-[10px] font-semibold uppercase tracking-wider text-brand-600">
            {brand?.name}
          </p>
          <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-midnight-900 transition-colors group-hover:text-brand-600 dark:text-white">
            {product.name}
          </h3>
          <div className="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-midnight-900 dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function DealsBanner({ slides, t }) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [slides])

  useEffect(() => {
    if (paused || slides.length < 2) return undefined
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500)
    return () => clearInterval(id)
  }, [paused, slides.length])

  const current = slides[slide]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55 }}
      className="relative h-full min-h-[440px] overflow-hidden rounded-[1.75rem] bg-midnight-900 shadow-lift md:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <motion.div
          key={s.id}
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: i === slide ? 1 : 0,
            scale: i === slide ? 1 : 1.06
          }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={s.image}
            alt=""
            className="h-full w-full object-cover"
            animate={i === slide ? { scale: [1, 1.08] } : { scale: 1 }}
            transition={{ duration: 4.5, ease: 'linear' }}
            decoding="async"
          />
        </motion.div>
      ))}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(10,22,40,0.55) 0%, rgba(15,33,55,0.28) 45%, rgba(10,22,40,0.72) 100%)'
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3.5 py-1.5 text-[11px] font-bold text-white">
            <Icon name="zap" size={13} />
            {t('deals.flashTitle')}
          </span>
          <CountdownTimer className="shrink-0 [&_div]:bg-white/95 [&_div]:backdrop-blur-sm" />
        </div>

        <div className="max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-2 text-xs font-semibold tracking-wide text-brand-300">{current.eyebrow}</p>
              <h2 className="font-display mb-3 text-3xl font-bold leading-[1.35] text-white md:text-4xl lg:text-[2.6rem]">
                {current.title}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-white/80 md:text-base">{current.subtitle}</p>
              <Link
                to={current.to}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-midnight-900 transition-all hover:bg-brand-50"
              >
                {t('deals.shopNow')}
                <Icon name="arrowRight" size={16} className="rtl:hidden" />
                <Icon name="arrowLeft" size={16} className="hidden rtl:inline" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4" dir="ltr">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slide ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Icon name="arrowLeft" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => setSlide((s) => (s + 1) % slides.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Deals() {
  const { t } = useTranslation()
  const { formatPrice, products } = useStore()

  const flash = products.filter((p) => p.badges?.includes('flashSale'))
  const withDiscount = products
    .filter((p) => p.originalPrice)
    .sort((a, b) => discountPercent(b.price, b.originalPrice) - discountPercent(a.price, a.originalPrice))

  const sideDeals = useMemo(() => {
    const pool = (flash.length >= 6 ? flash : withDiscount).slice(0, 6)
    return { left: pool.slice(0, 3), right: pool.slice(3, 6) }
  }, [flash, withDiscount])

  const bannerSlides = useMemo(
    () => [
      {
        id: 'b1',
        image: BANNER_IMAGES[0],
        eyebrow: t('deals.flashTitle'),
        title: t('deals.banner1Title'),
        subtitle: t('deals.banner1Subtitle'),
        to: '/products?sort=discount'
      },
      {
        id: 'b2',
        image: BANNER_IMAGES[1],
        eyebrow: t('common.limited'),
        title: t('deals.banner2Title'),
        subtitle: t('deals.banner2Subtitle'),
        to: '/new-arrivals'
      },
      {
        id: 'b3',
        image: BANNER_IMAGES[2],
        eyebrow: t('nav.brands'),
        title: t('deals.banner3Title'),
        subtitle: t('deals.banner3Subtitle'),
        to: '/brands'
      },
      {
        id: 'b4',
        image: BANNER_IMAGES[3],
        eyebrow: t('nav.bestSellers'),
        title: t('deals.banner4Title'),
        subtitle: t('deals.banner4Subtitle'),
        to: '/best-sellers'
      },
      {
        id: 'b5',
        image: BANNER_IMAGES[4],
        eyebrow: t('common.hot'),
        title: t('deals.banner5Title'),
        subtitle: t('deals.banner5Subtitle'),
        to: '/category/electronics'
      },
      {
        id: 'b6',
        image: BANNER_IMAGES[5],
        eyebrow: t('gifts.title'),
        title: t('deals.banner6Title'),
        subtitle: t('deals.banner6Subtitle'),
        to: '/gift-cards'
      },
      {
        id: 'b7',
        image: BANNER_IMAGES[6],
        eyebrow: t('common.featured'),
        title: t('deals.banner7Title'),
        subtitle: t('deals.banner7Subtitle'),
        to: '/category/fashion'
      },
      {
        id: 'b8',
        image: BANNER_IMAGES[7],
        eyebrow: t('deals.endsSoon'),
        title: t('deals.banner8Title'),
        subtitle: t('deals.banner8Subtitle'),
        to: '/coupons'
      }
    ],
    [t]
  )

  return (
    <div>
      <div className="relative overflow-hidden bg-slate-50 pb-4 pt-5 dark:bg-midnight-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,68,24,0.08),transparent_55%)]" />
        <div className="relative mx-auto max-w-[100rem] px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-center md:mb-8"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">{t('common.limited')}</p>
            <h1 className="font-display text-3xl font-bold text-midnight-900 dark:text-white md:text-4xl">{t('deals.title')}</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 md:text-base">{t('deals.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,2.4fr)_minmax(220px,0.55fr)] lg:gap-4">
            <aside className="order-2 flex flex-col gap-3 lg:order-1">
              {sideDeals.left.map((p, i) => (
                <SideDealCard key={p.id} product={p} formatPrice={formatPrice} index={i} />
              ))}
            </aside>

            <div className="order-1 lg:order-2">
              <DealsBanner slides={bannerSlides} t={t} />
            </div>

            <aside className="order-3 flex flex-col gap-3">
              {sideDeals.right.map((p, i) => (
                <SideDealCard key={p.id} product={p} formatPrice={formatPrice} index={i + 3} />
              ))}
            </aside>
          </div>
        </div>
      </div>

      <Breadcrumb items={[{ label: t('nav.deals') }]} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-midnight-900 dark:text-white">{t('deals.todayTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500">{t('deals.todaySubtitle')}</p>
          </div>
          <CountdownTimer />
        </div>
        <ProductGrid products={flash} cols={4} />

        <div className="mb-6 mt-14 flex items-center gap-3">
          <Icon name="tag" size={20} className="text-brand-600" />
          <h2 className="font-display text-2xl font-semibold text-midnight-900 dark:text-white">
            {t('deals.upTo', { percent: 40 })}
          </h2>
        </div>
        <ProductGrid products={withDiscount.slice(0, 12)} cols={4} />
      </div>
      <FeatureBar />
    </div>
  )
}
