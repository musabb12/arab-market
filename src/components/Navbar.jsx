import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

/** Routes with a dark full-bleed hero under the fixed navbar */
function hasDarkHeroOverlay(pathname) {
  if (pathname === '/') return true
  if (
    pathname.startsWith('/deals') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/order-confirmation') ||
    pathname.startsWith('/seller') ||
    pathname === '/404'
  ) {
    return false
  }
  return true
}

function Dropdown({ trigger, children, align = 'right', light = false }) {
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
            : light
              ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/45'
              : 'border-slate-200 bg-white text-midnight-800 hover:border-slate-300 hover:bg-slate-50 dark:border-white/15 dark:bg-midnight-900 dark:text-white dark:hover:bg-midnight-800'
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
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 bg-white dark:bg-midnight-900 rounded-2xl shadow-lift border border-slate-100 dark:border-white/10 py-2 min-w-[200px] z-50`}
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
  const location = useLocation()
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
    settings,
    theme,
    setTheme
  } = useStore()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => (typeof window !== 'undefined' ? window.scrollY > 24 : false))
  const catRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setScrolled(window.scrollY > 24)
    setCatOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

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
  const top = hasDarkHeroOverlay(location.pathname) && !scrolled

  const mainLinks = [
    { to: '/', key: 'nav.home' },
    { to: '/deals', key: 'nav.deals', badge: 'FLASH' },
    { to: '/new-arrivals', key: 'nav.newArrivals' },
    { to: '/best-sellers', key: 'nav.bestSellers' },
    { to: '/brands', key: 'nav.brands' },
    { to: '/gift-cards', key: 'gifts.title' }
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      <div
        className={`transition-all duration-300 border-b ${
          top
            ? 'bg-transparent border-white/15'
            : 'bg-white dark:bg-midnight-950 border-slate-200 dark:border-white/10 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 md:gap-4">
          <button
            className={`md:hidden p-2 -ms-2 transition-colors ${top ? 'text-white' : 'text-midnight-900 dark:text-white'}`}
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Icon name="menu" size={24} />
          </button>

          <Link to="/" className="shrink-0">
            <span
              className={`font-display font-extrabold tracking-tight transition-colors ${
                top ? 'text-white' : 'text-midnight-900 dark:text-white'
              } text-3xl md:text-4xl leading-none`}
            >
              {settings?.siteName || 'Ciar'}{' '}
              <span className={top ? 'text-brand-300' : 'text-brand-600'}>{settings?.siteSuffix || 'VIP'}</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className={`flex-1 max-w-2xl ${ltr ? 'ms-1' : 'me-1'} hidden md:flex items-center relative`}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className={`w-full rounded-full border py-3 ps-5 pe-28 text-sm outline-none transition-all ${
                top
                  ? 'border-white/25 bg-white/10 text-white placeholder:text-white/60 focus:border-white/50 focus:bg-white/15'
                  : 'border-slate-200 bg-slate-50 text-midnight-900 dark:bg-midnight-900 dark:border-white/10 dark:text-white focus:border-brand-400 focus:bg-white dark:focus:bg-midnight-800 focus:ring-4 focus:ring-brand-50'
              }`}
            />
            <button
              type="submit"
              className={`absolute ${ltr ? 'right-1' : 'left-1'} top-1 bottom-1 px-5 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <Icon name="search" size={16} />
              <span className="hidden lg:inline">{t('search.button')}</span>
            </button>
          </form>

          <div className="flex items-center gap-1.5 ms-auto">
            <div className="hidden lg:flex items-center gap-1.5 me-1">
              <Dropdown
                align={menuAlign}
                light={top}
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
                light={top}
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

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`inline-flex items-center gap-1.5 p-2.5 rounded-full transition-colors ${top ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-50 dark:hover:bg-white/10 text-midnight-900 dark:text-white'}`}
              aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
            </button>

            <Link
              to="/track-order"
              className={`hidden xl:flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                top ? 'text-white/90 hover:text-white' : 'text-midnight-800 dark:text-slate-200 hover:text-brand-600'
              }`}
            >
              <Icon name="truck" size={18} />
              <span>{t('nav.trackOrder')}</span>
            </Link>

            <Link
              to={user ? '/wishlist' : '/login'}
              state={user ? undefined : { from: '/wishlist' }}
              className={`relative p-2.5 rounded-full transition-colors ${top ? 'hover:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/10'}`}
              aria-label={t('nav.wishlist')}
            >
              <Icon name="heart" size={22} className={top ? 'text-white' : 'text-midnight-900 dark:text-white'} />
              {user && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">{wishlist.length}</span>
              )}
            </Link>

            {user ? (
              <Dropdown
                align={menuAlign}
                light={top}
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
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    top ? 'text-white hover:bg-white/10' : 'text-midnight-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10'
                  }`}
                >
                  {t('topBar.login')}
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    top
                      ? 'keep-white bg-white text-[#0f2137] hover:bg-slate-100'
                      : 'bg-midnight-900 text-white hover:bg-midnight-800 dark:keep-white dark:bg-white dark:text-[#0f2137] dark:hover:bg-slate-100'
                  }`}
                >
                  {t('topBar.register')}
                </Link>
              </div>
            )}

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: '/cart' } })
                  return
                }
                setCartOpen(true)
              }}
              className={`relative p-2.5 rounded-full transition-colors ${top ? 'hover:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/10'}`}
              aria-label={t('nav.cart')}
            >
              <Icon name="cart" size={22} className={top ? 'text-white' : 'text-midnight-900 dark:text-white'} />
              {user && cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`hidden md:block transition-all duration-300 border-b ${
          top ? 'bg-transparent border-white/10' : 'bg-white dark:bg-midnight-950 border-slate-100 dark:border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-sm">
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                catOpen
                  ? 'text-brand-600'
                  : top
                    ? 'text-white hover:text-brand-300'
                    : 'text-midnight-900 dark:text-white hover:text-brand-600'
              }`}
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
                  className="absolute start-0 top-full w-[760px] bg-white dark:bg-midnight-900 rounded-2xl shadow-lift border border-slate-100 dark:border-white/10 grid grid-cols-2 gap-1 p-4 z-50"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/category/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      onClick={() => setCatOpen(false)}
                    >
                      <img src={c.image} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <span className="block text-sm font-semibold text-midnight-900 dark:text-white group-hover:text-brand-600 transition-colors">{t(c.nameKey)}</span>
                        <span className="block text-xs text-slate-400 truncate">{(c.subcategories || []).slice(0, 3).join(' · ')}</span>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1 flex-1">
            {mainLinks.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                className={`relative px-3 py-3 font-medium transition-colors ${
                  top ? 'text-white/85 hover:text-white' : 'text-midnight-900/80 dark:text-slate-200 hover:text-brand-600'
                }`}
              >
                {t(l.key)}
                {l.badge && (
                  <span className={`absolute top-1.5 end-1 text-[8px] font-bold ${top ? 'text-brand-300' : 'text-red-600'}`}>{l.badge}</span>
                )}
              </Link>
            ))}
            <Link to="/sell" className="ms-auto px-4 py-2.5 rounded-full bg-brand-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
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
              className={`absolute top-0 ${ltr ? 'left-0' : 'right-0'} h-full w-80 bg-white dark:bg-midnight-950 shadow-lift overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10">
                <span className="font-display font-bold text-lg text-midnight-900 dark:text-white">{settings?.siteName || 'Ciar'} {settings?.siteSuffix || 'VIP'}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-slate-500 hover:text-midnight-900 dark:hover:text-white"
                    aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                  >
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
                  </button>
                  <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500" aria-label="Close">
                    <Icon name="close" size={22} />
                  </button>
                </div>
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
