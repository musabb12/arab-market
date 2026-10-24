import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import Icon from '../components/Icons.jsx'

const STORAGE_KEY = 'ciar_fitting_profile'

const COLOR_PRESETS = [
  '#111827', '#f8fafc', '#d6c7b0', '#78350f', '#1e3a8a', '#b91c1c',
  '#f9a8d4', '#065f46', '#b45309', '#581c87', '#64748b', '#c2410c'
]

const EU_SIZES = ['34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56']

const hexRgb = (h) => {
  const x = String(h || '').replace('#', '')
  if (x.length !== 6) return null
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]
}

const rgbDist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

// Extract dominant colors from an image using canvas quantization
async function extractPalette(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const s = 60
        const c = document.createElement('canvas')
        c.width = s
        c.height = s
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0, s, s)
        const { data } = ctx.getImageData(0, 0, s, s)
        const buckets = {}
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 200) continue
          const key = `${data[i] >> 5 << 5}-${data[i + 1] >> 5 << 5}-${data[i + 2] >> 5 << 5}`
          buckets[key] = (buckets[key] || 0) + 1
        }
        const top = Object.entries(buckets)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([k]) => {
            const [r, g, b] = k.split('-').map((n) => Number(n) + 16)
            return `#${((1 << 24) + (Math.min(r, 255) << 16) + (Math.min(g, 255) << 8) + Math.min(b, 255)).toString(16).slice(1)}`
          })
        resolve(top)
      } catch {
        resolve([])
      }
    }
    img.onerror = () => resolve([])
    img.src = src
  })
}

// Estimate a clothing size from body measurements
function recommendSize(m) {
  const chest = Number(m.chest)
  if (!chest) return null
  if (m.segment === 'women') {
    const eu = 34 + Math.round(Math.max(0, chest - 82) / 4) * 2
    return String(Math.min(56, Math.max(34, eu)))
  }
  const eu = Math.round(chest / 4) * 2
  return String(Math.min(56, Math.max(44, eu)))
}

const DEFAULT_WEIGHTS = { category: 30, segment: 10, color: 25, size: 15, budget: 15, rating: 5, fit: 5 }

function matchScore(p, profile, recSize, w = DEFAULT_WEIGHTS) {
  let score = 0
  const cats = profile.categories || []
  const palette = [...(profile.colors || []), ...(profile.palette || [])]
  const sizes = profile.sizes || []

  if (cats.length) score += cats.includes(p.category) ? w.category : 0
  else score += Math.round(w.category * 0.4)

  if (profile.segment && p.category === profile.segment) score += w.segment

  if (palette.length && (p.colors || []).length) {
    const pref = palette.map(hexRgb).filter(Boolean)
    let best = 999
    for (const c of p.colors) {
      const rgb = hexRgb(c)
      if (!rgb) continue
      for (const pr of pref) best = Math.min(best, rgbDist(rgb, pr))
    }
    if (best < 70) score += w.color
    else if (best < 130) score += Math.round(w.color * 0.65)
    else if (best < 200) score += Math.round(w.color * 0.32)
  } else if (!(p.colors || []).length) score += Math.round(w.color * 0.2)

  const wanted = [...sizes, recSize].filter(Boolean)
  if (wanted.length && (p.sizes || []).length) {
    if (p.sizes.some((s) => wanted.includes(s))) score += w.size
    else if (recSize && p.sizes.some((s) => Math.abs(Number(s) - Number(recSize)) <= 2)) score += Math.round(w.size * 0.6)
  } else if (!(p.sizes || []).length) score += Math.round(w.size * 0.5)

  const budget = Number(profile.budget) || 0
  if (budget > 0) {
    if (p.price <= budget) score += w.budget
    else if (p.price <= budget * 1.25) score += Math.round(w.budget * 0.5)
  } else score += Math.round(w.budget * 0.4)

  score += Math.min(w.rating, p.rating || 0)

  const text = `${p.name} ${p.description || ''}`.toLowerCase()
  if (profile.fit === 'slim' && /slim|fitted|tailored|cinched/.test(text)) score += w.fit
  if (profile.fit === 'oversized' && /oversized|relaxed|loose|wide/.test(text)) score += w.fit

  return Math.min(98, Math.round(score))
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
        active
          ? 'bg-midnight-900 text-white dark:bg-white dark:text-midnight-900'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-midnight-800 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

function StepCard({ n, icon, title, sub, children }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 md:p-7 shadow-soft dark:bg-midnight-900 dark:border-white/10">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white font-display font-bold">{n}</span>
        <div>
          <h3 className="font-bold text-midnight-900 dark:text-white">{title}</h3>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <Icon name={icon} size={20} className="ms-auto text-brand-500" />
      </div>
      {children}
    </div>
  )
}

export default function FittingRoom() {
  const { t, i18n } = useTranslation()
  const { products, categories, formatPrice, toast, user, siteData } = useStore()
  const cfg = siteData.fitting || {}
  const weights = useMemo(() => ({ ...DEFAULT_WEIGHTS, ...(cfg.weights || {}) }), [cfg.weights])

  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const set = (patch) => setProfile((p) => ({ ...p, ...patch }))
  const toggleArr = (key, v) => setProfile((p) => {
    const arr = p[key] || []
    return { ...p, [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] }
  })

  const recSize = useMemo(() => recommendSize(profile), [profile])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const onPhoto = async (url) => {
    set({ photo: url })
    if (!url) { set({ palette: [] }); return }
    setAnalyzing(true)
    const palette = await extractPalette(url)
    set({ palette })
    setAnalyzing(false)
  }

  const results = useMemo(() => {
    if (!showResults) return []
    return products
      .map((p) => ({ p, score: matchScore(p, profile, recSize, weights) }))
      .filter((r) => r.score >= (cfg.minScore ?? 25))
      .sort((a, b) => b.score - a.score)
      .slice(0, cfg.resultsCount || 8)
  }, [products, profile, recSize, weights, cfg.minScore, cfg.resultsCount, showResults])

  const similar = useMemo(() => {
    if (!results.length) return []
    const used = new Set(results.map((r) => r.p.id))
    const topCats = [...new Set(results.slice(0, 3).map((r) => r.p.category))]
    return products.filter((p) => !used.has(p.id) && topCats.includes(p.category)).slice(0, 4)
  }, [results, products])

  const prefCatNames = (profile.categories || []).map((id) => categories.find((c) => c.id === id))
    .filter(Boolean).map((c) => t(c.nameKey, { defaultValue: c.name || c.id }))

  const inputCls = 'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-midnight-900 outline-none focus:border-brand-500 dark:bg-midnight-800 dark:border-white/10 dark:text-white'
  const labelCls = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5'

  if (cfg.enabled === false) {
    return (
      <div className="bg-slate-50 dark:bg-midnight-950 min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-midnight-800">
            <Icon name="sparkle" size={28} />
          </span>
          <h1 className="font-display text-2xl font-bold text-midnight-900 dark:text-white">{t('fitting.unavailable')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('fitting.unavailableSub')}</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-midnight-900 px-7 py-3 text-sm font-bold text-white">
            {t('nav.home')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-midnight-950 min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-midnight-950">
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(224,68,24,0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.25), transparent 55%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300"
          >
            <Icon name="sparkle" size={14} /> {t('fitting.badge')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-5 font-display text-4xl md:text-6xl font-bold text-white"
          >
            {t('fitting.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-4 text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t('fitting.subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 — photo */}
            {cfg.showPhoto !== false && (
            <StepCard n={1} icon="upload" title={t('fitting.step1')} sub={t('fitting.step1Sub')}>
              <ImageUploader value={profile.photo || ''} onChange={onPhoto} />
              {analyzing && (
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-600">
                  <Icon name="sparkle" size={14} className="animate-pulse" /> {t('fitting.analyzing')}
                </p>
              )}
              {(profile.palette || []).length > 0 && !analyzing && (
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500">{t('fitting.paletteFound')}</span>
                  {profile.palette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleArr('colors', c)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${(profile.colors || []).includes(c) ? 'border-brand-600 ring-2 ring-brand-200' : 'border-white shadow'}`}
                      style={{ background: c }}
                      title={t('fitting.addToPrefs')}
                    />
                  ))}
                </div>
              )}
            </StepCard>
            )}

            {/* Step 2 — measurements */}
            {cfg.showMeasurements !== false && (
            <StepCard n={2} icon="user" title={t('fitting.step2')} sub={t('fitting.step2Sub')}>
              <div className="mb-4">
                <span className={labelCls}>{t('fitting.segment')}</span>
                <div className="flex gap-2">
                  {['women', 'men'].map((s) => (
                    <Chip key={s} active={profile.segment === s} onClick={() => set({ segment: profile.segment === s ? null : s })}>
                      {t(`fitting.segment_${s}`)}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ['height', 'fitting.height'],
                  ['weight', 'fitting.weight'],
                  ['chest', 'fitting.chest'],
                  ['waist', 'fitting.waist'],
                  ['hips', 'fitting.hips'],
                  ['shoe', 'fitting.shoe']
                ].map(([k, key]) => (
                  <label key={k}>
                    <span className={labelCls}>{t(key)}</span>
                    <input
                      type="number" dir="ltr" className={inputCls}
                      value={profile[k] || ''}
                      onChange={(e) => set({ [k]: e.target.value })}
                    />
                  </label>
                ))}
              </div>
              {recSize && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40 px-4 py-3">
                  <Icon name="sparkle" size={18} className="text-brand-600 shrink-0" />
                  <p className="text-sm text-brand-800 dark:text-brand-200">
                    {t('fitting.recSize')} <span className="font-bold" dir="ltr">EU {recSize}</span>
                  </p>
                </div>
              )}
              <div className="mt-4">
                <span className={labelCls}>{t('fitting.fit')}</span>
                <div className="flex flex-wrap gap-2">
                  {['slim', 'regular', 'oversized'].map((f) => (
                    <Chip key={f} active={profile.fit === f} onClick={() => set({ fit: profile.fit === f ? null : f })}>
                      {t(`fitting.fit_${f}`)}
                    </Chip>
                  ))}
                </div>
              </div>
            </StepCard>
            )}

            {/* Step 3 — preferences */}
            {cfg.showPreferences !== false && (
            <StepCard n={3} icon="heart" title={t('fitting.step3')} sub={t('fitting.step3Sub')}>
              <div className="space-y-5">
                <div>
                  <span className={labelCls}>{t('fitting.prefCats')}</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <Chip key={c.id} active={(profile.categories || []).includes(c.id)} onClick={() => toggleArr('categories', c.id)}>
                        {t(c.nameKey, { defaultValue: c.name || c.id })}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>{t('fitting.prefColors')}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c} type="button" onClick={() => toggleArr('colors', c)}
                        className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${(profile.colors || []).includes(c) ? 'border-brand-600 ring-2 ring-brand-200 scale-110' : 'border-white shadow'}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>{t('fitting.prefSizes')}</span>
                  <div className="flex flex-wrap gap-2">
                    {EU_SIZES.map((s) => (
                      <Chip key={s} active={(profile.sizes || []).includes(s)} onClick={() => toggleArr('sizes', s)}>{s}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={labelCls}>{t('fitting.budget', { value: formatPrice(Number(profile.budget) || 0) })}</span>
                  <input
                    type="range" min="100" max={cfg.budgetMax || 50000} step="100" dir="ltr"
                    value={profile.budget || 0}
                    onChange={(e) => set({ budget: Number(e.target.value) })}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            </StepCard>
            )}
          </div>

          {/* AI panel */}
          <div className="space-y-6">
            <div className="sticky top-[calc(var(--site-nav-h)+1rem)] rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:bg-midnight-900 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-midnight-900 text-white">
                  <Icon name="sparkle" size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-midnight-900 dark:text-white">{t('fitting.aiPanel')}</h3>
                  <p className="text-[11px] text-emerald-500 font-semibold">{t('fitting.aiReady')}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-midnight-800/60 p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2">
                <p>{t('fitting.aiHello', { name: user?.name ? ` ${user.name.split(' ')[0]}` : '' })}</p>
                {prefCatNames.length > 0 && <p>{t('fitting.aiCats', { cats: prefCatNames.join('، ') })}</p>}
                {recSize && <p>{t('fitting.aiSize', { size: recSize })}</p>}
                {(profile.colors || []).length > 0 && <p>{t('fitting.aiColors', { count: profile.colors.length })}</p>}
                {profile.photo && <p>{t('fitting.aiPhoto')}</p>}
              </div>

              <button
                onClick={() => {
                  setShowResults(true)
                  toast(t('fitting.toast'))
                  setTimeout(() => document.getElementById('fitting-results')?.scrollIntoView({ behavior: 'smooth' }), 80)
                }}
                className="mt-5 w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="sparkle" size={16} /> {t('fitting.findMatches')}
              </button>
              <p className="mt-3 text-[11px] text-center text-slate-400">{t('fitting.privacy')}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <motion.div id="fitting-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-24">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-soft p-6 md:p-8 dark:bg-midnight-900 dark:border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="sparkle" size={22} className="text-brand-600" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-midnight-900 dark:text-white">{t('fitting.results')}</h2>
                  <p className="text-xs text-slate-400">{t('fitting.resultsSub', { count: results.length })}</p>
                </div>
              </div>
              {results.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-slate-500">{t('fitting.noResults')}</p>
                  <Link to="/products" className="mt-4 inline-block rounded-full bg-midnight-900 px-6 py-2.5 text-xs font-bold text-white">{t('common.shopNow')}</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                  {results.map(({ p, score }) => (
                    <div key={p.id} className="relative">
                      <span className="absolute top-2 start-2 z-10 rounded-full bg-midnight-900/85 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                        {t('fitting.match', { pct: score })}
                      </span>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}

              {similar.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-xl font-bold text-midnight-900 dark:text-white mb-4">{t('fitting.similar')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                    {similar.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
