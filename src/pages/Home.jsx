import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { SectionHeader, ProductGrid, FeatureBar } from '../components/Layout.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import StarRating from '../components/StarRating.jsx'
import Icon from '../components/Icons.jsx'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { formatPrice, products, categories, brands, testimonials, content, settings } = useStore()
  const [slide, setSlide] = useState(0)

  const heroSlides = (content.heroSlides || []).filter((s) => s.enabled !== false).map((s) => ({
    id: s.id,
    image: s.image,
    title: t(`home.slides.${s.id}.title`, { defaultValue: s.title }),
    sub: t(`home.slides.${s.id}.subtitle`, { defaultValue: s.subtitle })
  }))

  useEffect(() => {
    if (!heroSlides.length) return
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500)
    return () => clearInterval(id)
  }, [heroSlides.length])

  const flashProducts = products.filter((p) => p.badges?.includes('flashSale')).slice(0, 8)
  const featured = products.filter((p) => p.badges?.includes('featured')).slice(0, 8)
  const bestSellers = products.filter((p) => p.badges?.includes('bestSeller')).slice(0, 8)
  const newArrivals = products.filter((p) => p.badges?.includes('newArrival')).slice(0, 8)
  const deals = [...products].sort((a, b) => (a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0) - (b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0)).slice(0, 8)

  if (!heroSlides.length) return null

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-midnight-900 min-h-[560px] md:min-h-[640px] flex items-center">
        <div className="absolute inset-0 bg-hero-mesh opacity-60" />
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.58 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img src={heroSlides[slide].image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-900/85 via-midnight-900/55 to-midnight-900/25" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide}-${i18n.language}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-6">
                {heroSlides[slide].title}
              </h1>
              <p className="text-slate-200 text-lg leading-relaxed mb-8 max-w-xl">
                {heroSlides[slide].sub}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/products" className="group px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold flex items-center gap-2 hover:shadow-glow transition-all">
                  {t('home.heroCta')}
                  <Icon name="arrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/deals" className="px-8 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur text-white font-semibold hover:bg-white/20 transition-colors">
                  {t('home.heroCta2')}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-brand-400' : 'w-3 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '300M+', label: t('home.statsShoppers') },
            { value: '5M+', label: t('home.statsProducts') },
            { value: '50K+', label: t('home.statsBrands') },
            { value: '200+', label: t('home.statsCountries') }
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-gradient">{s.value}</p>
              <p className="text-xs md:text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.categoriesTitle')} subtitle={t('home.categoriesSubtitle')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 5) * 0.06 }}
              >
                <Link to={`/category/${c.id}`} className="group relative block aspect-[4/5] rounded-2xl overflow-hidden shadow-soft">
                  <img src={c.image} alt={t(c.nameKey)} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.gradient} opacity-75 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">{t(c.nameKey)}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-white/80 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      {t('common.shopNow')}
                      <Icon name="arrowRight" size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-red-700 via-rose-700 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_-10%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
                <Icon name="zap" size={14} />
                {t('common.limited')}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-2">{t('deals.flashTitle')}</h2>
              <p className="text-red-100">{t('deals.flashSubtitle')}</p>
            </div>
            <CountdownTimer className="text-white" />
          </div>
          <ProductGrid products={flashProducts} cols={4} />
          <div className="text-center mt-10">
            <Link to="/deals" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-red-700 font-semibold hover:bg-red-50 transition-colors">
              {t('deals.shopNow')}
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.featuredTitle')} subtitle={t('home.featuredSubtitle')} />
          <ProductGrid products={featured} cols={4} />
        </div>
      </section>

      {/* DEALS OF THE DAY */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.dealsTitle')} subtitle={t('home.dealsSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {deals.slice(0, 2).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/product/${p.id}`} className="group flex gap-5 bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lift transition-shadow">
                  <div className="w-40 md:w-52 shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <span className="text-xs font-bold text-red-600 mb-1">-{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%</span>
                    <h3 className="font-semibold text-midnight-900 mb-1 group-hover:text-brand-600 transition-colors">{p.name}</h3>
                    <StarRating rating={p.rating} size={13} />
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-bold text-midnight-900">{formatPrice(p.price)}</span>
                      <span className="text-sm text-slate-400 line-through">{formatPrice(p.originalPrice)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <ProductGrid products={deals.slice(2, 10)} cols={4} />
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.bestTitle')} subtitle={t('home.bestSubtitle')} />
          <ProductGrid products={bestSellers} cols={4} />
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden bg-midnight-900"
          >
            <div className="absolute inset-0 bg-hero-mesh" />
            <img src={content.promo.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="relative px-8 py-16 md:px-16 text-center max-w-2xl mx-auto">
              <span className="inline-block bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                {content.promo.badge}
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">{content.promo.title}</h2>
              <p className="text-slate-300 mb-8">{content.promo.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all">
                  {content.promo.cta}
                </Link>
                <Link to="/coupons" className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors">
                  {t('home.promoCta2')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.newTitle')} subtitle={t('home.newSubtitle')} />
          <ProductGrid products={newArrivals} cols={4} />
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.brandsTitle')} subtitle={t('home.brandsSubtitle')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              >
                <Link to={`/brand/${b.id}`} className="group flex flex-col items-center justify-center bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl py-8 px-4 hover:shadow-soft transition-all">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${b.gradient} text-white text-xl font-bold mb-3 group-hover:scale-110 transition-transform`}>
                    {b.logo}
                  </span>
                  <span className="text-sm font-semibold text-midnight-900 group-hover:text-brand-600 transition-colors">{b.name}</span>
                  <span className="text-xs text-slate-400 mt-0.5">{b.country}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title={t('home.testimonialsTitle')} subtitle={t('home.testimonialsSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((tm, i) => (
              <motion.div
                key={tm.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-soft"
              >
                <StarRating rating={tm.rating} size={15} className="mb-4" />
                <p className="text-slate-600 leading-relaxed mb-5">"{tm.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">
                    {tm.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight-900">{tm.name}</p>
                    <p className="text-xs text-slate-400">{tm.role} · {tm.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APP + TRUST */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-4">{t('home.appTitle')}</h2>
            <p className="text-slate-500 mb-8">{t('home.appSubtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-midnight-900 text-white rounded-2xl px-6 py-4 hover:bg-midnight-800 transition-colors">
                <Icon name="apple" size={26} />
                <span className="text-left">
                  <span className="block text-[10px] text-slate-400 uppercase">{t('home.appStore')}</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </button>
              <button className="flex items-center gap-3 bg-midnight-900 text-white rounded-2xl px-6 py-4 hover:bg-midnight-800 transition-colors">
                <Icon name="download" size={26} />
                <span className="text-left">
                  <span className="block text-[10px] text-slate-400 uppercase">{t('home.googlePlay')}</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </button>
            </div>
            <div className="mt-8 flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-5 max-w-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Icon name="lock" size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-midnight-900 mb-1">{t('home.trustTitle')}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t('home.trustText')}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lift">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80" alt="Premium product" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{t('common.bestSeller')}</p>
                  <p className="text-sm font-bold text-midnight-900">Kinetic Smart Watch Series X</p>
                </div>
                <Link to="/product/p4" className="px-4 py-2 rounded-full bg-midnight-900 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
                  {t('common.shopNow')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureBar />
    </div>
  )
}
