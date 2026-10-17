import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import CircleLink from './CircleLink.jsx'
import { subcategoryLabel, subcategoryImage } from '../utils/catalog.js'

/** SHEIN-style mobile store feed: category tabs, hero, look cards, 5-col circles, login strip. */
export default function MobileStoreFeed() {
  const { t, i18n } = useTranslation()
  const { categories, content, user, settings } = useStore()
  const [tab, setTab] = useState('all')
  const [slide, setSlide] = useState(0)
  const canBrowse = Boolean(user) || settings?.requireLogin === false

  const heroSlides = (content.heroSlides || []).filter((s) => s.enabled !== false).map((s) => ({
    id: s.id,
    image: s.image,
    title: t(`home.slides.${s.id}.title`, { defaultValue: s.title }),
    sub: t(`home.slides.${s.id}.subtitle`, { defaultValue: s.subtitle })
  }))

  useEffect(() => {
    if (!heroSlides.length) return
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(id)
  }, [heroSlides.length])

  const activeCategory = tab === 'all' ? null : categories.find((c) => c.id === tab)
  const circleItems = useMemo(() => {
    if (activeCategory) {
      return (activeCategory.subcategories || []).map((s) => ({
        key: s,
        to: canBrowse ? `/products?q=${encodeURIComponent(s)}&category=${activeCategory.id}` : '/login',
        state: canBrowse ? undefined : { from: `/category/${activeCategory.id}` },
        image: subcategoryImage(s, activeCategory.image),
        label: subcategoryLabel(t, s)
      }))
    }
    return categories.map((c) => ({
      key: c.id,
      to: canBrowse ? `/category/${c.id}` : '/login',
      state: canBrowse ? undefined : { from: `/category/${c.id}` },
      image: c.image,
      label: t(c.nameKey)
    }))
  }, [activeCategory, categories, canBrowse, t])

  const lookCards = useMemo(() => {
    const source = activeCategory || categories[0]
    if (!source) return []
    return (source.subcategories || []).slice(0, 8).map((s) => ({
      key: s,
      label: subcategoryLabel(t, s),
      image: subcategoryImage(s, source.image),
      to: canBrowse ? `/products?q=${encodeURIComponent(s)}&category=${source.id}` : '/login',
      state: canBrowse ? undefined : { from: `/category/${source.id}` }
    }))
  }, [activeCategory, categories, canBrowse, t])

  const tabs = [{ id: 'all', label: t('home.forYouAll') }, ...categories.map((c) => ({ id: c.id, label: t(c.nameKey) }))]
  const activeSlide = heroSlides[slide] || heroSlides[0]

  return (
    <div className="md:hidden bg-white dark:bg-midnight-950">
      {/* Category tabs */}
      <div className="sticky top-[var(--site-nav-h)] z-30 bg-white/95 dark:bg-midnight-950/95 backdrop-blur border-b border-slate-100 dark:border-white/10">
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-2">
          {tabs.map((tb) => {
            const active = tab === tb.id
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className={`relative shrink-0 px-3 py-3 text-[13px] font-semibold transition-colors ${
                  active ? 'text-midnight-950 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tb.label}
                {active && <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-midnight-950 dark:bg-white" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Compact hero */}
      <section className="relative h-[30vh] overflow-hidden bg-midnight-950">
        {heroSlides.map((s, i) => (
          <motion.div
            key={s.id || i}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 0.55 }}
          >
            <img src={s.image} alt="" className="h-full w-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 z-[1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide}-${i18n.language}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white text-sm font-semibold mb-1 line-clamp-1">{activeSlide?.title}</p>
              <p className="text-white/80 text-xs mb-3 line-clamp-1">{activeSlide?.sub}</p>
              <Link
                to={canBrowse ? '/products' : '/login'}
                className="inline-flex px-4 py-1.5 rounded-md bg-white text-midnight-950 text-xs font-bold"
              >
                {t('common.shopNow')}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        {heroSlides.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 z-[2] flex justify-center gap-1">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full ${i === slide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Rectangular look cards */}
      {lookCards.length > 0 && (
        <section className="pt-3 pb-1">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3">
            {lookCards.map((card) => (
              <Link
                key={card.key}
                to={card.to}
                state={card.state}
                className="shrink-0 w-[4.6rem] overflow-hidden rounded-md bg-midnight-950"
              >
                <img src={card.image} alt="" className="h-20 w-full object-cover" loading="lazy" />
                <span className="block bg-midnight-950 px-1 py-1.5 text-center text-[10px] font-semibold text-white leading-tight line-clamp-2 min-h-[2.25rem]">
                  {card.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5-column circular grid */}
      <section className="px-2 pt-4 pb-3">
        <div className="grid grid-cols-5 gap-x-1 gap-y-4">
          {circleItems.slice(0, 15).map((item) => (
            <CircleLink
              key={item.key}
              to={item.to}
              state={item.state}
              image={item.image}
              label={item.label}
              size="sm"
              className="w-full"
            />
          ))}
        </div>
        {circleItems.length > 15 && (
          <div className="text-center mt-4">
            <Link
              to={activeCategory ? `/category/${activeCategory.id}` : '/categories'}
              className="text-xs font-semibold text-brand-600"
            >
              {t('common.seeAll')}
            </Link>
          </div>
        )}
      </section>

      {/* Guest login strip — only when browsing requires membership */}
      {!canBrowse && (
        <section className="mx-3 mb-4 flex items-center justify-between gap-3 rounded-lg bg-midnight-950 px-3 py-2.5">
          <p className="text-xs font-semibold text-white leading-snug">{t('mobileNav.loginPrompt')}</p>
          <Link
            to="/login"
            state={{ from: '/' }}
            className="shrink-0 rounded-md bg-brand-600 px-3.5 py-2 text-xs font-bold text-white"
          >
            {t('auth.signIn')}
          </Link>
        </section>
      )}
    </div>
  )
}
