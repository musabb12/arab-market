import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

function AdCard({ ad, compact = false }) {
  return (
    <Link
      to={ad.link || '/products'}
      className={`group relative block overflow-hidden rounded-2xl ${compact ? 'h-44 md:h-56' : 'h-52 md:h-72'}`}
      style={ad.bgColor && !ad.image ? { background: ad.bgColor } : undefined}
    >
      {ad.image && (
        <img src={ad.image} alt={ad.title || ''} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
      <div className={`absolute inset-0 ${ad.image ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent' : 'bg-midnight-900/20'}`} />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        {ad.title && (
          <h3 className={`font-display font-bold text-white leading-tight ${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'}`}>
            {ad.title}
          </h3>
        )}
        {ad.subtitle && <p className="mt-1.5 max-w-lg text-xs md:text-sm text-white/80 line-clamp-2">{ad.subtitle}</p>}
        {ad.cta && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-midnight-900 group-hover:bg-brand-600 group-hover:text-white transition-colors">
            {ad.cta}
            <Icon name="arrowRight" size={13} className="rtl:rotate-180" />
          </span>
        )}
      </div>
    </Link>
  )
}

export function AdSlot({ position, compact }) {
  const { siteData } = useStore()
  const ads = (siteData.ads || []).filter((a) => a.enabled !== false && a.position === position)
  if (!ads.length) return null
  return (
    <div className={`grid gap-4 ${ads.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {ads.slice(0, 2).map((ad) => <AdCard key={ad.id} ad={ad} compact={compact || ads.length > 1} />)}
    </div>
  )
}

export function AdPopup() {
  const { siteData } = useStore()
  const ad = (siteData.ads || []).find((a) => a.enabled !== false && a.position === 'popup')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!ad) return
    if (sessionStorage.getItem('ciar_ad_popup_seen')) return
    const id = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('ciar_ad_popup_seen', '1')
    }, 2500)
    return () => clearTimeout(id)
  }, [ad])

  return (
    <AnimatePresence>
      {open && ad && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-midnight-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-lift"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-midnight-900/60 text-white hover:bg-midnight-900 transition-colors"
              aria-label="Close"
            >
              <Icon name="close" size={16} />
            </button>
            {ad.image && <img src={ad.image} alt="" className="h-56 w-full object-cover" />}
            <div className="p-6 text-center">
              {ad.title && <h3 className="font-display text-2xl font-bold text-midnight-900">{ad.title}</h3>}
              {ad.subtitle && <p className="mt-2 text-sm text-slate-500 leading-relaxed">{ad.subtitle}</p>}
              <Link
                to={ad.link || '/products'}
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors"
              >
                {ad.cta || ad.title}
                <Icon name="arrowRight" size={14} className="rtl:rotate-180" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
