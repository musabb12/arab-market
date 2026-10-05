import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { SectionHeader, ProductGrid, FeatureBar } from '../components/Layout.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import StarRating from '../components/StarRating.jsx'
import Icon from '../components/Icons.jsx'
import PaymentBrand, { NETWORK_BRANDS } from '../components/PaymentBrand.jsx'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { formatPrice, products, categories, testimonials, content, user, payments } = useStore()
  const [slide, setSlide] = useState(0)
  const isMember = Boolean(user)

  const heroSlides = (content.heroSlides || []).filter((s) => s.enabled !== false).map((s) => ({
    id: s.id,
    image: s.image,
    title: t(`home.slides.${s.id}.title`, { defaultValue: s.title }),
    sub: t(`home.slides.${s.id}.subtitle`, { defaultValue: s.subtitle })
  }))

  useEffect(() => {
    if (!heroSlides.length) return
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5500)
    return () => clearInterval(id)
  }, [heroSlides.length])

  useEffect(() => {
    ;(content.heroSlides || []).forEach((s) => {
      if (!s?.image) return
      const img = new Image()
      img.src = s.image
    })
  }, [content.heroSlides])

  const flashProducts = products.filter((p) => p.badges?.includes('flashSale')).slice(0, 8)
  const featured = products.filter((p) => p.badges?.includes('featured')).slice(0, 8)
  const bestSellers = products.filter((p) => p.badges?.includes('bestSeller')).slice(0, 8)
  const newArrivals = products.filter((p) => p.badges?.includes('newArrival')).slice(0, 8)
  const deals = [...products].sort((a, b) => (a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0) - (b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0)).slice(0, 8)

  const activeSlide = heroSlides[slide] || heroSlides[0]
  const shopLink = (to) => (isMember ? to : '/login')
  const shopState = isMember ? undefined : { from: '/products' }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-midnight-900 -mt-[var(--site-nav-h)] min-h-[560px] md:min-h-[640px] flex items-center">
        <div className="absolute inset-0">
          {heroSlides.map((s, i) => (
            <motion.div
              key={s.id || i}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === slide ? 1 : 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: i === slide ? 1 : 0 }}
            >
              <img
                src={s.image}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </motion.div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(115deg, rgba(10,33,64,0.48) 0%, rgba(28,58,102,0.32) 48%, rgba(12,40,72,0.44) 100%)'
          }}
        />
        <div className="relative z-[3] max-w-7xl mx-auto px-4 pt-[calc(var(--site-nav-h)+4rem)] pb-24 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide}-${i18n.language}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-5 [text-shadow:0_2px_10px_rgba(8,24,48,0.55)]">
                {activeSlide?.title || t('home.slides.h1.title', { defaultValue: 'Ciar VIP' })}
              </h1>
              <p className="text-slate-100 text-lg leading-relaxed mb-8 max-w-xl [text-shadow:0_2px_8px_rgba(8,24,48,0.45)]">
                {activeSlide?.sub || t('home.slides.h1.subtitle', { defaultValue: 'Premium products from around the world.' })}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {isMember ? (
                  <>
                    <Link to="/products" className="group px-8 py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center gap-2 transition-all">
                      {t('home.heroCta')}
                      <Icon name="arrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/deals" className="px-8 py-4 rounded-full bg-white text-midnight-900 font-semibold hover:bg-slate-100 transition-colors">
                      {t('home.heroCta2')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="group px-8 py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center gap-2 transition-all">
                      {t('auth.gateJoinCta')}
                      <Icon name="arrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" state={{ from: '/' }} className="px-8 py-4 rounded-full bg-white text-midnight-900 font-semibold hover:bg-slate-100 transition-colors">
                      {t('auth.signIn')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-[90vw]">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'}`}
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

      {/* CATEGORIES — members shop; guests see teaser → login */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(224,68,24,0.08), transparent)' }}
        />
        <div className="relative max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <SectionHeader title={t('home.categoriesTitle')} subtitle={t('home.categoriesSubtitle')} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {categories.map((c, i) => {
              const subCount = c.subcategories?.length || 0
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={shopLink(`/category/${c.id}`)}
                    state={isMember ? undefined : { from: `/category/${c.id}` }}
                    className="group relative block aspect-[3/4] rounded-[1.35rem] md:rounded-[1.5rem] overflow-hidden shadow-[0_18px_40px_-28px_rgba(15,33,55,0.55)] ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_55px_-30px_rgba(224,68,24,0.45)] hover:ring-brand-500/30"
                  >
                    <img
                      src={c.image}
                      alt={t(c.nameKey)}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.14]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/45 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to top, rgba(224,68,24,0.22), transparent)' }}
                    />

                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 md:p-5">
                      <span className="mb-2.5 block h-0.5 w-8 rounded-full bg-brand-500 transition-all duration-500 group-hover:w-14" />
                      <h3 className="font-display text-base sm:text-lg md:text-[1.15rem] font-semibold text-white leading-snug mb-1">
                        {t(c.nameKey)}
                      </h3>
                      {subCount > 0 && (
                        <p className="text-[11px] sm:text-xs text-white/55 mb-2.5">
                          {t('home.categoryItems', { count: subCount, defaultValue: `${subCount}` })}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white/90 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {isMember ? t('common.shopNow') : t('auth.gateUnlock')}
                        <Icon name="arrowRight" size={12} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {isMember ? (
        <>
          {/* FLASH SALE */}
          <section className="py-16 md:py-20 bg-red-700 relative overflow-hidden">
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

          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeader title={t('home.featuredTitle')} subtitle={t('home.featuredSubtitle')} />
              <ProductGrid products={featured} cols={4} />
            </div>
          </section>

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

          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4">
              <SectionHeader title={t('home.bestTitle')} subtitle={t('home.bestSubtitle')} />
              <ProductGrid products={bestSellers} cols={4} />
            </div>
          </section>
        </>
      ) : (
        <section className="py-16 md:py-20 bg-midnight-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white mb-5">
              <Icon name="lock" size={14} />
              {t('auth.gateMembersOnly')}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">{t('auth.gateTitle')}</h2>
            <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8">{t('auth.gateSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-8 py-4 rounded-full bg-brand-600 text-white font-semibold hover:opacity-90 transition-opacity">
                {t('auth.gateJoinCta')}
              </Link>
              <Link to="/login" state={shopState} className="px-8 py-4 rounded-full bg-white text-midnight-900 font-semibold hover:bg-slate-100 transition-colors">
                {t('auth.signIn')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      {content.promo?.enabled !== false && (
        <section className="relative py-8 md:py-12 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2rem] min-h-[380px] md:min-h-[460px] shadow-[0_30px_80px_-40px_rgba(15,33,55,0.55)]"
            >
              <motion.img
                src={content.promo.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ scale: [1.04, 1.1, 1.04] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-midnight-950 via-midnight-950/82 to-midnight-950/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/75 via-transparent to-midnight-950/15" />
              <div
                className="absolute -top-28 end-[-4rem] w-[26rem] h-[26rem] rounded-full blur-3xl opacity-35 pointer-events-none"
                style={{ background: 'radial-gradient(circle, var(--mc-brand, #e04418) 0%, transparent 70%)' }}
              />

              <div className="relative z-10 grid md:grid-cols-12 min-h-[380px] md:min-h-[460px]">
                <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center p-8 sm:p-10 md:p-14 lg:ps-16 lg:pe-8">
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12, duration: 0.5 }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.16em] uppercase text-white bg-brand-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />
                      {t('home.promoBadge', { defaultValue: content.promo.badge })}
                    </span>
                    <span className="hidden sm:inline text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">
                      Ciar VIP
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.55 }}
                    className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold text-white leading-[1.15] mb-4 max-w-xl"
                  >
                    {t('home.promoTitle', { defaultValue: content.promo.title })}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.28, duration: 0.5 }}
                    className="text-sm md:text-base text-white/65 mb-8 leading-relaxed max-w-md"
                  >
                    {t('home.promoSubtitle', { defaultValue: content.promo.subtitle })}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.36, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-3"
                  >
                    {isMember ? (
                      <Link
                        to="/deals"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-brand-600 shadow-lg shadow-orange-900/25 transition-all hover:brightness-110 hover:-translate-y-0.5"
                      >
                        {t('home.promoCta', { defaultValue: content.promo.cta })}
                        <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </Link>
                    ) : (
                      <Link
                        to="/register"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-brand-600 shadow-lg shadow-orange-900/25 transition-all hover:brightness-110 hover:-translate-y-0.5"
                      >
                        {t('home.promoCta', { defaultValue: content.promo.cta })}
                        <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </Link>
                    )}
                    <Link
                      to={isMember ? '/coupons' : '/about'}
                      className="inline-flex items-center px-7 py-3.5 rounded-2xl text-sm font-semibold text-white/90 border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/12 hover:border-white/35 transition-all"
                    >
                      {isMember ? t('home.promoCta2') : t('common.learnMore')}
                    </Link>
                  </motion.div>
                </div>

                <div className="hidden md:flex md:col-span-5 lg:col-span-6 items-end justify-end p-8 md:p-12 lg:p-14">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    <div className="absolute -inset-8 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] backdrop-blur-xl px-9 py-8 text-center shadow-2xl min-w-[11rem]">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2">
                        {t('home.promoBadge', { defaultValue: content.promo.badge })}
                      </p>
                      <p className="font-display text-5xl md:text-6xl font-bold leading-none text-brand-500">
                        {t('home.promoDiscount')}
                      </p>
                      <p className="mt-2.5 text-sm text-white/70 font-medium">
                        {t('home.promoDiscountLabel')}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {isMember && (
        <section className="py-16 md:py-20 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader title={t('home.newTitle')} subtitle={t('home.newSubtitle')} />
            <ProductGrid products={newArrivals} cols={4} />
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-slate-50">
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">
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
      <section className="py-16 md:py-20 bg-white dark:bg-midnight-950">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 dark:text-white mb-4">{t('home.appTitle')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{t('home.appSubtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-midnight-900 text-white rounded-2xl px-6 py-4 hover:bg-midnight-800 transition-colors">
                <Icon name="apple" size={26} />
                <span className="text-left rtl:text-right">
                  <span className="block text-[10px] text-slate-400 uppercase">{t('home.appStore')}</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </button>
              <button className="flex items-center gap-3 bg-midnight-900 text-white rounded-2xl px-6 py-4 hover:bg-midnight-800 transition-colors">
                <Icon name="download" size={26} />
                <span className="text-left rtl:text-right">
                  <span className="block text-[10px] text-slate-400 uppercase">{t('home.googlePlay')}</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </button>
            </div>
            <div className="mt-8 flex items-start gap-3 bg-slate-50 dark:bg-midnight-900 border border-slate-100 dark:border-white/10 rounded-2xl p-5 max-w-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600">
                <Icon name="lock" size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-midnight-900 dark:text-white mb-1">{t('home.trustTitle')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t('home.trustText')}</p>
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
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute bottom-5 left-5 right-5 bg-white dark:bg-midnight-900 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{t('common.bestSeller')}</p>
                  <p className="text-sm font-bold text-midnight-900 dark:text-white">Kinetic Smart Watch Series X</p>
                </div>
                <Link to={shopLink('/product/p4')} state={isMember ? undefined : { from: '/product/p4' }} className="px-4 py-2 rounded-full bg-midnight-900 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
                  {t('common.shopNow')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-slate-50 dark:bg-midnight-900/40 border-y border-slate-100 dark:border-white/5">
        <div
          className="pointer-events-none absolute -top-24 end-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(224,68,24,0.18), transparent 70%)' }}
        />
        <div className="relative max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <SectionHeader title={t('home.paymentsTitle')} subtitle={t('home.paymentsSubtitle')} />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-10">
            {(payments || []).map((p, i) => {
                const active = p.enabled !== false
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className={`group rounded-2xl md:rounded-[1.35rem] border p-5 md:p-7 text-center shadow-soft transition-all duration-300 ${
                      active
                        ? 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-midnight-900 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-[0_20px_40px_-28px_rgba(224,68,24,0.35)]'
                        : 'border-slate-100 dark:border-white/5 bg-white/90 dark:bg-midnight-950/50 opacity-90'
                    }`}
                  >
                    <span className="mx-auto mb-4 flex h-[5.5rem] md:h-28 w-full max-w-[11rem] items-center justify-center rounded-2xl border border-slate-100 dark:border-white/10 bg-white px-4 py-3 shadow-sm">
                      <PaymentBrand
                        id={p.id}
                        size="lg"
                        title={t(`home.payment_${p.id}`, { defaultValue: p.name })}
                      />
                    </span>
                    <p className="text-sm font-semibold text-midnight-900 dark:text-white leading-snug">
                      {t(`home.payment_${p.id}`, { defaultValue: p.name })}
                    </p>
                    <p className={`mt-1.5 text-[11px] font-medium ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {active ? t('home.paymentAvailable') : t('home.paymentSoon')}
                    </p>
                  </motion.div>
                )
              })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[1.5rem] md:rounded-[1.75rem] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-midnight-900 p-6 md:p-8 shadow-soft"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              <div className="lg:min-w-[220px]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-2">
                  {t('home.paymentNetworks')}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('home.paymentNetworksText')}
                </p>
              </div>
              <div className="flex-1 flex flex-wrap items-center gap-3 md:gap-4">
                {NETWORK_BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center justify-center min-w-[6.5rem] md:min-w-[7.5rem] h-16 md:h-[4.5rem] px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white shadow-sm"
                  >
                    <PaymentBrand id={brand} size="md" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 pt-7 border-t border-slate-100 dark:border-white/10 grid sm:grid-cols-3 gap-5">
              {[
                { icon: 'lock', title: t('home.paymentBenefit1Title'), text: t('home.paymentBenefit1Text') },
                { icon: 'shield', title: t('home.paymentBenefit2Title'), text: t('home.paymentBenefit2Text') },
                { icon: 'zap', title: t('home.paymentBenefit3Title'), text: t('home.paymentBenefit3Text') }
              ].map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600">
                    <Icon name={b.icon} size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight-900 dark:text-white mb-0.5">{b.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureBar />
    </div>
  )
}
