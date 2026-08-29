import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
          open
            ? 'border-brand-200 bg-brand-50 text-brand-700'
            : 'border-slate-200 bg-white text-midnight-800 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        {trigger}
        <Icon name="chevronDown" size={13} className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 bg-white rounded-2xl shadow-lift border border-slate-100 py-2 min-w-[200px] z-50`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    cartCount,
    wishlist,
    setCartOpen,
    currency,
    setCurrency,
    language,
    setLanguage,
    user,
    logout,
    categories,
    activeLanguages,
    activeCurrencies,
    settings
  } = useStore()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const currentLang = activeLanguages.find((l) => l.code === (language || 'en'))
  const ltr = i18n.dir() === 'ltr'
  const menuAlign = ltr ? 'right' : 'left'

  const mainLinks = [
    { to: '/', key: 'nav.home' },
    { to: '/deals', key: 'nav.deals', badge: 'FLASH' },
    { to: '/new-arrivals', key: 'nav.newArrivals' },
    { to: '/best-sellers', key: 'nav.bestSellers' },
    { to: '/brands', key: 'nav.brands' },
    { to: '/gift-cards', key: 'gifts.title' }
  ]

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 md:gap-4">
          <button className="md:hidden p-2 -ms-2 text-midnight-900" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Icon name="menu" size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-glow font-display text-lg font-bold text-white">
              {settings?.logoText || 'A'}
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block font-display text-lg font-bold text-midnight-900">{settings?.siteName || 'ARAB'}</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">{settings?.siteSuffix || 'Market'}</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className={`flex-1 max-w-2xl ${ltr ? 'ms-1' : 'me-1'} hidden md:flex items-center relative`}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 ps-5 pe-28 text-sm outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-50 transition-all"
            />
            <button
              type="submit"
              className={`absolute ${ltr ? 'right-1' : 'left-1'} top-1 bottom-1 px-5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <Icon name="search" size={16} />
              <span className="hidden lg:inline">{t('search.button')}</span>
            </button>
          </form>

          <div className="flex items-center gap-1.5 ms-auto">
            <div className="hidden lg:flex items-center gap-1.5 me-1">
              <Dropdown
                align={menuAlign}
                trigger={
                  <>
                    <Icon name="globe" size={14} />
                    <span className="max-w-[5.5rem] truncate">{currentLang?.name || 'Language'}</span>
                  </>
                }
              >
                <div className="max-h-80 overflow-y-auto">
                  {activeLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${l.code === language ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span className="flex h-6 w-9 items-center justify-center rounded-md bg-slate-900 text-white text-[10px] font-bold">{l.short || l.code.toUpperCase()}</span>
                      <span>{l.name}</span>
                      {l.code === language && <Icon name="check" size={14} className="ms-auto" />}
                    </button>
                  ))}
                </div>
              </Dropdown>

              <Dropdown
                align={menuAlign}
                trigger={
                  <>
                    <Icon name="creditCard" size={14} />
                    <span>{currency}</span>
                  </>
                }
              >
                {activeCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${c.code === currency ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span>{c.code}</span>
                    <span className="text-slate-400 text-xs">{c.symbol}</span>
                    {c.code === currency && <Icon name="check" size={14} className="ms-auto" />}
                  </button>
                ))}
              </Dropdown>
            </div>

            <Link to="/track-order" className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm font-medium text-midnight-800 hover:text-brand-600 transition-colors">
              <Icon name="truck" size={18} />
              <span>{t('nav.trackOrder')}</span>
            </Link>

            <Link to="/wishlist" className="relative p-2.5 rounded-full hover:bg-slate-50 transition-colors" aria-label={t('nav.wishlist')}>
              <Icon name="heart" size={22} className="text-midnight-900" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">{wishlist.length}</span>
              )}
            </Link>

            {user ? (
              <Dropdown
                align={menuAlign}
                trigger={
                  <>
                    <Icon name="user" size={14} />
                    <span className="hidden sm:inline max-w-[6rem] truncate">{user.name?.split(' ')[0]}</span>
                  </>
                }
              >
                <Link to="/account" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">{t('nav.account')}</Link>
                <Link to="/account/orders" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">{t('nav.orders')}</Link>
                <Link to="/seller" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">{t('nav.sell')}</Link>
                <button onClick={logout} className="w-full text-start px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">{t('nav.logout')}</button>
              </Dropdown>
            ) : (
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-full text-sm font-semibold text-midnight-800 hover:bg-slate-50 transition-colors"
                >
                  {t('topBar.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-midnight-900 text-white text-sm font-semibold hover:bg-midnight-800 transition-colors"
                >
                  {t('topBar.register')}
                </Link>
              </div>
            )}

            <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-full hover:bg-slate-50 transition-colors" aria-label={t('nav.cart')}>
              <Icon name="cart" size={22} className="text-midnight-900" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-sm">
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${catOpen ? 'text-brand-600' : 'text-midnight-900 hover:text-brand-600'}`}
            >
              <Icon name="menu" size={18} />
              {t('nav.categories')}
              <Icon name="chevronDown" size={16} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute start-0 top-full w-[760px] bg-white rounded-2xl shadow-lift border border-slate-100 grid grid-cols-2 gap-1 p-4 z-50"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      onClick={() => setCatOpen(false)}
                    >
                      <img src={c.image} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-midnight-900 group-hover:text-brand-600 transition-colors">{t(c.nameKey)}</span>
                        <span className="block text-xs text-slate-400 truncate">{c.subcategories.slice(0, 3).join(' · ')}</span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1 flex-1">
            {mainLinks.map((l) => (
              <Link key={l.key} to={l.to} className="relative px-3 py-3 font-medium text-midnight-900/80 hover:text-brand-600 transition-colors">
                {t(l.key)}
                {l.badge && (
                  <span className="absolute top-1.5 end-1 text-[8px] font-bold text-red-600">{l.badge}</span>
                )}
              </Link>
            ))}
            <Link to="/sell" className="ms-auto px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              {t('nav.sell')}
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: ltr ? -320 : 320 }}
              animate={{ x: 0 }}
              exit={{ x: ltr ? -320 : 320 }}
              transition={{ type: 'tween', duration: 0.28 }}
              className={`absolute top-0 ${ltr ? 'left-0' : 'right-0'} h-full w-80 bg-white shadow-lift overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <span className="font-display font-bold text-lg text-midnight-900">{settings?.siteName || 'ARAB'} {settings?.siteSuffix || 'Market'}</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500" aria-label="Close">
                  <Icon name="close" size={22} />
                </button>
              </div>
              <form onSubmit={(e) => { submitSearch(e); setMobileOpen(false) }} className="p-4">
                <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search.placeholder')} className="flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
                  <button type="submit" className="px-4 text-brand-600" aria-label={t('search.button')}><Icon name="search" size={18} /></button>
                </div>
              </form>
              <nav className="px-2 pb-6">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2 px-2 mb-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-midnight-900">
                      {t('topBar.login')}
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl bg-midnight-900 text-white text-sm font-semibold">
                      {t('topBar.register')}
                    </Link>
                  </div>
                ) : (
                  <div className="px-2 mb-3">
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl bg-slate-50 text-sm font-semibold text-midnight-900">
                      {user.name}
                    </Link>
                  </div>
                )}
                {mainLinks.map((l) => (
                  <Link key={l.key} to={l.to} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-midnight-900 hover:bg-slate-50 rounded-lg">
                    {t(l.key)}
                  </Link>
                ))}
                <Link to="/track-order" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-midnight-900 hover:bg-slate-50 rounded-lg">{t('nav.trackOrder')}</Link>
                <Link to="/sell" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-midnight-900 hover:bg-slate-50 rounded-lg">{t('nav.sell')}</Link>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('common.language')}</span>
                  <div className="grid grid-cols-2 gap-1 mt-2 px-2">
                    {activeLanguages.map((l) => (
                      <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-3 py-2 text-sm rounded-lg text-start ${l.code === language ? 'bg-brand-600 text-white' : 'bg-slate-100 text-midnight-900'}`}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                  <span className="block px-4 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('common.currency')}</span>
                  <div className="flex flex-wrap gap-1 mt-2 px-4">
                    {activeCurrencies.map((c) => (
                      <button key={c.code} onClick={() => setCurrency(c.code)} className={`px-3 py-1.5 text-xs rounded-full border ${c.code === currency ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold' : 'border-slate-200 text-slate-600'}`}>
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
