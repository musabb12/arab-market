import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { SectionHeader, ProductGrid, FeatureBar } from '../components/Layout.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StarRating from '../components/StarRating.jsx'
import Icon from '../components/Icons.jsx'
import PaymentBrand, { NETWORK_BRANDS } from '../components/PaymentBrand.jsx'

function HomeTitle({ title, subtitle, action, light = false }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
      <div className="min-w-0">
        <h2 className={`font-display text-2xl md:text-[2rem] font-bold leading-tight ${light ? 'text-white' : 'text-midnight-900 dark:text-white'}`}>{title}</h2>
        {subtitle && <p className={`mt-1 text-xs md:text-sm ${light ? 'text-amber-200/80' : 'text-slate-500 dark:text-slate-400'}`}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function ViewAll({ to, state, label, light = false }) {
  return (
    <Link
      to={to}
      state={state}
      className={`shrink-0 inline-flex items-center gap-1 text-xs md:text-sm font-semibold transition-colors ${light ? 'text-white/80 hover:text-amber-300' : 'text-midnight-900 dark:text-white hover:text-brand-600'}`}
    >
      {label}
      <Icon name="chevronRight" size={15} className="rtl:rotate-180" />
    </Link>
  )
}

function SaleClock() {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const tick = () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      setLeft(Math.max(0, end.getTime() - Date.now()))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const parts = [Math.floor(left / 3600000), Math.floor((left % 3600000) / 60000), Math.floor((left % 60000) / 1000)]
  return (
    <span className="inline-flex items-center gap-1" dir="ltr">
      {parts.map((v, i) => (
        <React.Fragment key={i}>
          <span className="min-w-[1.9rem] rounded-md bg-midnight-950 dark:bg-white px-1.5 py-1 text-center text-xs font-bold tabular-nums text-white dark:text-midnight-950">
            {String(v).padStart(2, '0')}
          </span>
          {i < 2 && <span className="text-xs font-bold text-midnight-900 dark:text-white">:</span>}
        </React.Fragment>
      ))}
    </span>
  )
}

function ProductRail({ products }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    const rtl = getComputedStyle(el).direction === 'rtl'
    el.scrollBy({ left: (rtl ? -dir : dir) * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-1">
        {products.map((p, i) => (
          <div key={p.id} className="w-[46%] sm:w-[31%] md:w-[23.5%] lg:w-[18.6%] shrink-0 snap-start">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
      {products.length > 5 && (
        <>
          <button
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute z-10 top-[38%] -start-4 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-midnight-800 text-midnight-900 dark:text-white shadow-lift border border-slate-100 dark:border-white/10 hover:bg-midnight-900 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <Icon name="chevronLeft" size={18} className="rtl:rotate-180" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="hidden md:flex absolute z-10 top-[38%] -end-4 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-midnight-800 text-midnight-900 dark:text-white shadow-lift border border-slate-100 dark:border-white/10 hover:bg-midnight-900 hover:text-white transition-colors"
            aria-label="Next"
          >
            <Icon name="chevronRight" size={18} className="rtl:rotate-180" />
          </button>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const { formatPrice, products, categories, brands, testimonials, content, user, payments } = useStore()
  const [slide, setSlide] = useState(0)
  const [tab, setTab] = useState('all')
  const [visible, setVisible] = useState(15)
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

  useEffect(() => setVisible(15), [tab])

  const flashProducts = products.filter((p) => p.badges?.includes('flashSale')).slice(0, 12)
  const rareProducts = products.filter((p) => p.badges?.includes('rare')).slice(0, 12)
  const feed = useMemo(() => {
    if (tab !== 'all') return products.filter((p) => p.category === tab)
    const groups = categories.map((c) => products.filter((p) => p.category === c.id)).filter((g) => g.length)
    const mixed = []
    for (let i = 0; mixed.length < products.length && groups.some((g) => g[i]); i++) groups.forEach((g) => g[i] && mixed.push(g[i]))
    return mixed
  }, [products, categories, tab])
  const rareBrands = (brands || []).filter((b) => b.rare)
  const spotlight = ['watches', 'bags', 'jewelry', 'women', 'fragrance'].map((id) => categories.find((c) => c.id === id)).filter(Boolean)
  const appProduct = products.find((p) => p.category === 'watches' && p.badges?.includes('featured')) || products[0]

  const testimonialText = (tm) => {
    const key = `home.testimonialsText.${(tm.name || '').replace(/[^a-z]/gi, '')}`
    return i18n.getFixedT('en')(key, { defaultValue: '' }) === tm.text ? t(key) : tm.text
  }
  const activeSlide = heroSlides[slide] || heroSlides[0]
  const shopLink = (to) => (isMember ? to : '/login')
  const shopState = (to) => (isMember ? undefined : { from: to })
  const go = (dir) => setSlide((s) => (s + dir + heroSlides.length) % heroSlides.length)

  const perks = [
    { icon: 'shield', label: t('home.perk1') },
    { icon: 'truck', label: t('home.perk2') },
    { icon: 'headset', label: t('home.perk3') },
    { icon: 'refresh', label: t('home.perk4') }
  ]

  return (
    <div className="bg-slate-50 dark:bg-midnight-950">
      {/* HERO */}
      <section className="relative h-[440px] sm:h-[500px] md:h-[580px] overflow-hidden bg-midnight-950">
        {heroSlides.map((s, i) => (
          <motion.div
            key={s.id || i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0, scale: i === slide ? 1 : 1.04 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: i === slide ? 1 : 0 }}
          >
            <img src={s.image} alt="" className="h-full w-full object-cover" decoding="async" />
          </motion.div>
        ))}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r rtl:bg-gradient-to-l from-black/75 via-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative z-[3] h-full max-w-7xl mx-auto px-4 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide}-${i18n.language}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300 mb-4">
                <span className="h-px w-8 bg-amber-300" />
                Ciar VIP
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                {activeSlide?.title}
              </h1>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-7 max-w-lg">{activeSlide?.sub}</p>
              <div className="flex flex-wrap items-center gap-3">
                {isMember ? (
                  <>
                    <Link to="/products" className="group px-7 py-3.5 rounded-full bg-white text-midnight-950 font-bold text-sm flex items-center gap-2 hover:bg-amber-100 transition-colors">
                      {t('home.heroCta')}
                      <Icon name="arrowRight" size={16} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/brands" className="px-7 py-3.5 rounded-full border border-white/50 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                      {t('nav.brands')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="group px-7 py-3.5 rounded-full bg-white text-midnight-950 font-bold text-sm flex items-center gap-2 hover:bg-amber-100 transition-colors">
                      {t('auth.gateJoinCta')}
                      <Icon name="arrowRight" size={16} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" state={{ from: '/' }} className="px-7 py-3.5 rounded-full border border-white/50 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                      {t('auth.signIn')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {heroSlides.length > 1 && (
          <>
            <button onClick={() => go(-1)} className="hidden md:flex absolute z-[3] start-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-midnight-950 transition-colors" aria-label="Previous">
              <Icon name="chevronLeft" size={20} className="rtl:rotate-180" />
            </button>
            <button onClick={() => go(1)} className="hidden md:flex absolute z-[3] end-5 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white hover:text-midnight-950 transition-colors" aria-label="Next">
              <Icon name="chevronRight" size={20} className="rtl:rotate-180" />
            </button>
            <div className="absolute bottom-5 inset-x-0 z-[3] flex justify-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-3 bg-white/45 hover:bg-white/70'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* PERKS */}
      <section className="bg-white dark:bg-midnight-900 border-b border-slate-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex gap-7 overflow-x-auto no-scrollbar md:justify-between">
          {perks.map((p) => (
            <div key={p.icon} className="flex items-center gap-2 shrink-0 text-xs md:text-[13px] font-semibold text-midnight-900 dark:text-white">
              <Icon name={p.icon} size={18} className="text-amber-600" />
              {p.label}
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="py-9 md:py-12 bg-white dark:bg-midnight-950">
        <div className="max-w-7xl mx-auto px-4">
          <HomeTitle title={t('home.shopByCategory')} subtitle={t('home.categoriesSubtitle')} />
          <div className="flex md:grid md:grid-cols-7 gap-4 md:gap-x-4 md:gap-y-8 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={shopLink(`/category/${c.id}`)}
                state={shopState(`/category/${c.id}`)}
                className="group flex flex-col items-center gap-2.5 shrink-0 w-[78px] md:w-auto"
              >
                <span className="relative block h-[74px] w-[74px] md:h-[7.5rem] md:w-[7.5rem] rounded-full p-[2.5px] bg-gradient-to-br from-amber-200 via-amber-600 to-amber-300 shadow-[0_10px_25px_-15px_rgba(180,120,20,0.8)]">
                  <span className="block h-full w-full overflow-hidden rounded-full bg-white dark:bg-midnight-950 p-[2px]">
                    <img src={c.image} alt={t(c.nameKey)} loading="lazy" className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                </span>
                <span className="text-[11px] md:text-[13px] font-semibold text-center leading-tight text-midnight-900 dark:text-white group-hover:text-brand-600 transition-colors">
                  {t(c.nameKey)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RARE MAISONS */}
      {rareBrands.length > 0 && (
        <section className="py-10 md:py-14 bg-midnight-950 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 start-1/3 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4">
            <HomeTitle
              light
              title={t('home.rareBrandsTitle')}
              subtitle={t('home.rareBrandsSubtitle')}
              action={<ViewAll light to={shopLink('/brands')} state={shopState('/brands')} label={t('home.allBrands')} />}
            />
            <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1">
              {rareBrands.map((b) => (
                <Link
                  key={b.id}
                  to={shopLink(`/brand/${b.id}`)}
                  state={shopState(`/brand/${b.id}`)}
                  className="group shrink-0 w-36 md:w-44 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center transition-all hover:border-amber-400/60 hover:bg-white/[0.06]"
                >
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 font-display text-lg font-bold text-amber-300 transition-transform group-hover:scale-110" dir="ltr">
                    {b.logo}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-white truncate" dir="ltr">{b.name}</p>
                  <p className="text-[11px] text-white/45 truncate">{b.country}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {isMember && flashProducts.length > 0 && (
        <section className="py-10 md:py-14 bg-white dark:bg-midnight-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5 md:mb-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="font-display text-2xl md:text-[2rem] font-bold text-midnight-900 dark:text-white flex items-center gap-2">
                  <Icon name="zap" size={22} className="text-red-600" />
                  {t('home.privateSaleTitle')}
                </h2>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  {t('home.endsIn')}
                  <SaleClock />
                </span>
              </div>
              <ViewAll to="/deals" label={t('common.seeAll')} />
            </div>
            <ProductRail products={flashProducts} />
          </div>
        </section>
      )}

      {/* WORLDS OF LUXURY */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <HomeTitle title={t('home.spotlightTitle')} />
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:h-[580px]">
            {spotlight.map((c, i) => {
              const count = products.filter((p) => p.category === c.id).length
              return (
                <Link
                  key={c.id}
                  to={shopLink(`/category/${c.id}`)}
                  state={shopState(`/category/${c.id}`)}
                  className={`group relative overflow-hidden rounded-2xl bg-midnight-900 ${i === 0 ? 'col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/5] md:aspect-auto'}`}
                >
                  <img src={c.image} alt={t(c.nameKey)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 mb-1">{t('home.productsCount', { count })}</p>
                    <h3 className={`font-display font-bold text-white leading-tight ${i === 0 ? 'text-3xl md:text-4xl' : 'text-lg md:text-xl'}`}>{t(c.nameKey)}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/85 group-hover:text-white">
                      {t('common.explore')}
                      <Icon name="chevronRight" size={14} className="rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {isMember && rareProducts.length > 0 && (
        <section className="py-10 md:py-14 bg-white dark:bg-midnight-950">
          <div className="max-w-7xl mx-auto px-4">
            <HomeTitle
              title={
                <span className="flex items-center gap-2">
                  <Icon name="gem" size={22} className="text-amber-600" />
                  {t('home.rareTitle')}
                </span>
              }
              subtitle={t('home.rareSubtitle')}
              action={<ViewAll to="/products" label={t('common.seeAll')} />}
            />
            <ProductRail products={rareProducts} />
          </div>
        </section>
      )}

      {!isMember && (
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
              <Link to="/login" state={{ from: '/products' }} className="px-8 py-4 rounded-full bg-white text-midnight-900 font-semibold hover:bg-slate-100 transition-colors">
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
        <section className="py-10 md:py-14 bg-white dark:bg-midnight-950">
          <div className="max-w-7xl mx-auto px-4">
            <HomeTitle title={t('home.forYouTitle')} />
            <div className="sticky top-[var(--site-nav-h)] z-20 -mx-4 px-4 py-3 mb-6 bg-white/95 dark:bg-midnight-950/95 backdrop-blur border-b border-slate-100 dark:border-white/10">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {[{ id: 'all', label: t('home.forYouAll') }, ...categories.map((c) => ({ id: c.id, label: t(c.nameKey) }))].map((tb) => (
                  <button
                    key={tb.id}
                    onClick={() => setTab(tb.id)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs md:text-[13px] font-semibold transition-colors ${
                      tab === tb.id
                        ? 'bg-midnight-950 text-white dark:bg-white dark:text-midnight-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-midnight-900 dark:text-slate-300 dark:hover:bg-midnight-800'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
            </div>
            <ProductGrid products={feed.slice(0, visible)} cols={5} />
            {visible < feed.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + 10)}
                  className="px-12 py-3.5 rounded-full border-2 border-midnight-900 dark:border-white text-sm font-bold text-midnight-900 dark:text-white hover:bg-midnight-900 hover:text-white dark:hover:bg-white dark:hover:text-midnight-950 transition-colors"
                >
                  {t('home.loadMore')}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-midnight-900/40">
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
                className="bg-white dark:bg-midnight-900 rounded-2xl p-7 border border-slate-100 dark:border-white/10 shadow-soft"
              >
                <StarRating rating={tm.rating} size={15} className="mb-4" />
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5" dir="auto">“{testimonialText(tm)}”</p>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">
                    {tm.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight-900 dark:text-white" dir="auto">{tm.name}</p>
                    <p className="text-xs text-slate-400">
                      {tm.role === 'Private Client' ? t('home.privateClient') : tm.role} · {t(`home.testimonialCountries.${(tm.country || '').replace(/\s/g, '')}`, { defaultValue: tm.country })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APP + TRUST */}
      <section className="py-16 md:py-20 bg-white dark:bg-midnight-950 overflow-hidden">
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
              <img src={appProduct?.image} alt="" className="w-full aspect-[4/3] object-cover" />
              <div className="absolute bottom-5 left-5 right-5 bg-white dark:bg-midnight-900 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider" dir="ltr">{(brands || []).find((b) => b.id === appProduct?.brand)?.name}</p>
                  <p className="text-sm font-bold text-midnight-900 dark:text-white line-clamp-1">{appProduct?.name}</p>
                </div>
                <Link to={shopLink(`/product/${appProduct?.id}`)} state={shopState(`/product/${appProduct?.id}`)} className="px-4 py-2 rounded-full bg-midnight-900 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
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
