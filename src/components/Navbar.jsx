import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'
import { subcategoryLabel } from '../utils/catalog.js'

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
  const [msgIndex, setMsgIndex] = useState(0)
  const catRef = useRef(null)
  const headerRef = useRef(null)

  const messages = [t('topBar.msg1'), t('topBar.ship'), t('topBar.msg2'), t('topBar.msg3')]

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const apply = () => document.documentElement.style.setProperty('--site-nav-h', `${el.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 4500)
    return () => clearInterval(id)
  }, [messages.length])

  useEffect(() => {
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

  const currentLang = activeLanguages.find((l) => l.code === (language || 'ar'))
  const ltr = i18n.dir() === 'ltr'
  const menuAlign = ltr ? 'right' : 'left'
  const path = location.pathname

  const stripLinks = [
    { to: '/products', label: t('home.forYouAll') },
    { to: '/new-arrivals', label: t('nav.newArrivals') },
    ...categories.map((c) => ({ to: `/category/${c.id}`, label: t(c.nameKey) })),
    { to: '/deals', label: t('nav.deals'), accent: true },
    { to: '/brands', label: t('nav.brands') }
  ]

  const drawerLinks = [
    { to: '/', key: 'nav.home' },
    { to: '/deals', key: 'nav.deals' },
    { to: '/new-arrivals', key: 'nav.newArrivals' },
    { to: '/best-sellers', key: 'nav.bestSellers' },
    { to: '/brands', key: 'nav.brands' },
    { to: '/gift-cards', key: 'gifts.title' }
  ]

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-50">
      <div className="bg-midnight-950 text-white h-8 flex items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${msgIndex}-${i18n.language}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-[11px] sm:text-xs tracking-wide truncate"
          >
            <span className="text-amber-300 me-2">✦</span>
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="bg-white dark:bg-midnight-950 border-b border-slate-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 md:gap-5">
          <button
            className="md:hidden p-2 -ms-2 text-midnight-900 dark:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Icon name="menu" size={24} />
          </button>

          <Link to="/" className="min-w-0 shrink">
            <span className="block truncate font-display font-extrabold tracking-tight text-midnight-900 dark:text-white text-[1.7rem] sm:text-3xl md:text-[2.4rem] leading-none">
              {settings?.siteName || 'Ciar'} <span className="text-brand-600">{settings?.siteSuffix || 'VIP'}</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="flex-1 max-w-2xl hidden md:flex items-center relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full rounded-full border-2 border-midnight-900 dark:border-white/20 bg-white dark:bg-midnight-900 py-2.5 ps-5 pe-14 text-sm text-midnight-900 dark:text-white outline-none transition-colors focus:border-brand-600"
            />
            <button
              type="submit"
              className={`absolute ${ltr ? 'right-1' : 'left-1'} top-1 bottom-1 w-11 rounded-full bg-midnight-900 dark:bg-brand-600 text-white flex items-center justify-center hover:bg-brand-600 transition-colors`}
              aria-label={t('search.button')}
            >
              <Icon name="search" size={17} />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-0 sm:gap-1 ms-auto">
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

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:block p-2.5 rounded-full transition-colors hover:bg-slate-50 dark:hover:bg-white/10 text-midnight-900 dark:text-white"
              aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
            </button>

            <Link
              to="/track-order"
              className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm font-medium text-midnight-800 dark:text-slate-200 hover:text-brand-600 transition-colors"
            >
              <Icon name="truck" size={18} />
              <span>{t('nav.trackOrder')}</span>
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
                  className="px-3.5 py-2 rounded-full text-sm font-semibold text-midnight-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                  {t('topBar.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-midnight-900 text-white hover:bg-midnight-800 dark:keep-white dark:bg-white dark:text-[#0f2137] dark:hover:bg-slate-100 transition-colors"
                >
                  {t('topBar.register')}
                </Link>
              </div>
            )}

            <Link
              to={user ? '/wishlist' : '/login'}
              state={user ? undefined : { from: '/wishlist' }}
              className="relative p-2 sm:p-2.5 rounded-full transition-colors hover:bg-slate-50 dark:hover:bg-white/10"
              aria-label={t('nav.wishlist')}
            >
              <Icon name="heart" size={22} className="text-midnight-900 dark:text-white" />
              {user && wishlist.length > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold">{wishlist.length}</span>
              )}
            </Link>

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login', { state: { from: '/cart' } })
                  return
                }
                setCartOpen(true)
              }}
              className="relative p-2 sm:p-2.5 rounded-full transition-colors hover:bg-slate-50 dark:hover:bg-white/10"
              aria-label={t('nav.cart')}
            >
              <Icon name="cart" size={22} className="text-midnight-900 dark:text-white" />
              {user && cartCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="md:hidden px-4 pb-2.5">
          <div className="flex items-center rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-midnight-900 overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-midnight-900 dark:text-white"
            />
            <button type="submit" className="px-4 text-midnight-900 dark:text-white" aria-label={t('search.button')}>
              <Icon name="search" size={17} />
            </button>
          </div>
        </form>
      </div>

      <nav className="bg-white dark:bg-midnight-950 border-b border-slate-200 dark:border-white/10 shadow-[0_6px_18px_-16px_rgba(15,33,55,0.6)]">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <div className="relative hidden md:block shrink-0" ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-2 py-3 pe-3 text-sm font-bold transition-colors ${catOpen ? 'text-brand-600' : 'text-midnight-900 dark:text-white hover:text-brand-600'}`}
            >
              <Icon name="menu" size={18} />
              {t('nav.categories')}
              <Icon name="chevronDown" size={15} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute start-0 top-full w-[min(92vw,1040px)] bg-white dark:bg-midnight-900 rounded-b-2xl shadow-lift border border-slate-100 dark:border-white/10 grid grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5 p-6 z-50"
                >
                  {categories.map((c) => (
                    <div key={c.id} className="min-w-0">
                      <Link to={`/category/${c.id}`} className="group flex items-center gap-2.5 mb-2" onClick={() => setCatOpen(false)}>
                        <img src={c.image} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/10" loading="lazy" />
                        <span className="text-sm font-bold text-midnight-900 dark:text-white group-hover:text-brand-600 transition-colors">{t(c.nameKey)}</span>
                      </Link>
                      <ul className="space-y-1 ps-[3.1rem]">
                        {(c.subcategories || []).slice(0, 4).map((s) => (
                          <li key={s}>
                            <Link
                              to={`/category/${c.id}`}
                              onClick={() => setCatOpen(false)}
                              className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 transition-colors"
                            >
                              {subcategoryLabel(t, s)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {stripLinks.map((l) => {
              const active = path === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-[13px] font-semibold transition-colors ${
                    active
                      ? 'text-midnight-900 dark:text-white'
                      : l.accent
                        ? 'text-red-600 hover:text-red-700'
                        : 'text-slate-600 dark:text-slate-300 hover:text-midnight-900 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-midnight-900 dark:bg-white" />}
                </Link>
              )
            })}
          </div>

          <Link to="/sell" className="hidden lg:inline-flex shrink-0 px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity">
            {t('nav.sell')}
          </Link>
        </div>
      </nav>

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
              <nav className="px-2 py-4">
                {!user ? (
                  <div className="grid grid-cols-2 gap-2 px-2 mb-3">
                    <Link to="/login" className="text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-midnight-900 dark:text-white dark:border-white/15">
                      {t('topBar.login')}
                    </Link>
                    <Link to="/register" className="text-center py-2.5 rounded-xl bg-midnight-900 text-white text-sm font-semibold">
                      {t('topBar.register')}
                    </Link>
                  </div>
                ) : (
                  <div className="px-2 mb-3">
                    <Link to="/account" className="block px-4 py-3 rounded-xl bg-slate-50 dark:bg-midnight-900 text-sm font-semibold text-midnight-900 dark:text-white">
                      {user.name}
                    </Link>
                  </div>
                )}
                {drawerLinks.map((l) => (
                  <Link key={l.key} to={l.to} className="block px-4 py-3 text-sm font-medium text-midnight-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">
                    {t(l.key)}
                  </Link>
                ))}
                <span className="block px-4 mt-4 mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('nav.categories')}</span>
                <div className="grid grid-cols-2 gap-1 px-2">
                  {categories.map((c) => (
                    <Link key={c.id} to={`/category/${c.id}`} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
                      <img src={c.image} alt="" className="h-8 w-8 rounded-full object-cover" loading="lazy" />
                      <span className="text-xs font-medium text-midnight-900 dark:text-white truncate">{t(c.nameKey)}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/track-order" className="block px-4 py-3 mt-3 text-sm font-medium text-midnight-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">{t('nav.trackOrder')}</Link>
                <Link to="/sell" className="block px-4 py-3 text-sm font-medium text-midnight-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg">{t('nav.sell')}</Link>
                <div className="mt-4 border-t border-slate-100 dark:border-white/10 pt-4">
                  <span className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('common.language')}</span>
                  <div className="grid grid-cols-2 gap-1 mt-2 px-2">
                    {activeLanguages.map((l) => (
                      <button key={l.code} onClick={() => setLanguage(l.code)} className={`px-3 py-2 text-sm rounded-lg text-start ${l.code === language ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-midnight-900 text-midnight-900 dark:text-white'}`}>
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
