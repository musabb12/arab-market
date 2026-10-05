import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { LANGUAGE_META, CURRENCIES } from '../i18n/index.js'
import { defaultSiteData } from '../data/siteDefaults.js'
import { updateCatalog } from '../utils/catalog.js'
import { api, setToken, getStoredToken, isApiUnavailable } from '../api/client.js'

const StoreContext = createContext(null)

const STORAGE_KEYS = {
  cart: 'lumina_cart',
  wishlist: 'lumina_wishlist',
  currency: 'lumina_currency',
  compare: 'lumina_compare',
  user: 'lumina_user',
  orders: 'lumina_orders',
  siteData: 'lumina_siteData',
  admin: 'lumina_admin_session',
  theme: 'ciar_theme',
  localAccounts: 'ciar_local_accounts'
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function loadLocalAccounts() {
  return loadJSON(STORAGE_KEYS.localAccounts, [])
}

function saveLocalAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.localAccounts, JSON.stringify(accounts))
}

function makeLocalUser({ name, email, phone, role = 'customer' }) {
  return {
    id: `local-${Date.now()}`,
    name: name || email.split('@')[0],
    email: email.toLowerCase().trim(),
    phone: phone || '',
    role,
    local: true
  }
}

function deepMerge(base, override) {
  if (!override) return base
  if (Array.isArray(base) || Array.isArray(override)) return override
  if (typeof base !== 'object' || typeof override !== 'object') return override
  const out = { ...base }
  for (const k of Object.keys(override)) {
    out[k] = k in base ? deepMerge(base[k], override[k]) : override[k]
  }
  return out
}

const HERO_IMAGE_MIGRATION = {
  'photo-1469334031218-e382a71b716b': 'photo-1441986300917-64674bd600d8',
  'photo-1511707171634-5f897ff02aa9': 'photo-1498049794561-7780e7231661'
}

function migrateHeroImages(siteData) {
  if (!siteData?.content?.heroSlides && !siteData?.settings) return siteData
  let heroSlides = (siteData.content?.heroSlides || []).map((slide) => {
    let image = slide.image || ''
    for (const [from, to] of Object.entries(HERO_IMAGE_MIGRATION)) {
      if (image.includes(from)) {
        image = `https://images.unsplash.com/${to}?auto=format&fit=crop&w=1400&q=80`
        break
      }
    }
    return { ...slide, image }
  })

  const defaultSlides = defaultSiteData.content.heroSlides
  const needsHeroUpgrade =
    heroSlides.length < 10 ||
    heroSlides.some((s) => (s.image || '').includes('photo-1469334031218'))

  if (needsHeroUpgrade) {
    heroSlides = defaultSlides
  }

  const OLD_BRAND = new Set(['#3f6eee', '#3F6EEE'])
  const OLD_ACCENT = new Set(['#a855f7', '#A855F7'])
  const brandColor = OLD_BRAND.has(siteData.settings?.brandColor)
    ? '#e04418'
    : (siteData.settings?.brandColor || '#e04418')
  const accentColor = OLD_ACCENT.has(siteData.settings?.accentColor)
    ? '#0f2137'
    : (siteData.settings?.accentColor || '#0f2137')

  let promo = siteData.content?.promo || {}
  if (/Lumina/i.test(`${promo.badge || ''} ${promo.title || ''} ${promo.subtitle || ''} ${promo.cta || ''}`)) {
    promo = { ...defaultSiteData.content.promo, image: promo.image || defaultSiteData.content.promo.image }
  }

  const defaultPayments = defaultSiteData.payments || []
  const storedPayments = Array.isArray(siteData.payments) ? siteData.payments : []
  const allDigitalOff = ['paypal', 'applepay', 'googlepay'].every((id) => {
    const s = storedPayments.find((p) => p.id === id)
    return !s || s.enabled === false
  })
  const cardOff = storedPayments.find((p) => p.id === 'card')?.enabled === false
  const seedLooksStale = allDigitalOff && (cardOff || storedPayments.length === 0)
  const payments = defaultPayments.map((def) => {
    const stored = storedPayments.find((p) => p.id === def.id)
    if (!stored) return def
    if (seedLooksStale) return { ...def, ...stored, enabled: def.enabled }
    return { ...def, ...stored, enabled: stored.enabled ?? def.enabled }
  })

  const storedLanguages = Array.isArray(siteData.languages) ? siteData.languages : []
  const languages = [
    ...storedLanguages,
    ...(defaultSiteData.languages || []).filter((def) => !storedLanguages.some((l) => l.code === def.code))
  ]

  return {
    ...siteData,
    languages,
    payments,
    content: {
      ...siteData.content,
      heroSlides: heroSlides.length ? heroSlides : siteData.content?.heroSlides,
      promo
    },
    settings: {
      ...siteData.settings,
      siteName: ['ARAB', 'Lumina'].includes(siteData.settings?.siteName) ? 'Ciar' : (siteData.settings?.siteName || 'Ciar'),
      siteSuffix: ['Market', 'market'].includes(siteData.settings?.siteSuffix) ? 'VIP' : (siteData.settings?.siteSuffix || 'VIP'),
      logoText: ['L', 'A'].includes(siteData.settings?.logoText) ? 'C' : (siteData.settings?.logoText || 'C'),
      tagline: siteData.settings?.tagline?.includes('Arab') ? 'Premium Marketplace' : (siteData.settings?.tagline || 'Premium Marketplace'),
      brandColor,
      accentColor
    }
  }
}

function loadSiteData() {
  const stored = loadJSON(STORAGE_KEYS.siteData, null)
  const merged = deepMerge(defaultSiteData, stored)
  if (!Array.isArray(merged.products) || merged.products.length === 0) merged.products = defaultSiteData.products
  return migrateHeroImages(merged)
}

function loadTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyThemeClass(theme) {
  const root = document.documentElement
  const isDark = theme === 'dark'
  root.classList.toggle('dark', isDark)
  if (isDark) root.setAttribute('data-theme', 'dark')
  else root.setAttribute('data-theme', 'light')
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

function getInitialTheme() {
  const theme = loadTheme()
  if (typeof document !== 'undefined') applyThemeClass(theme)
  return theme
}

let toastSeq = 0

export function StoreProvider({ children }) {
  const { t } = useTranslation()
  const [cart, setCart] = useState(() => loadJSON(STORAGE_KEYS.cart, []))
  const [wishlist, setWishlist] = useState(() => loadJSON(STORAGE_KEYS.wishlist, []))
  const [compare, setCompare] = useState(() => loadJSON(STORAGE_KEYS.compare, []))
  const [currency, setCurrency] = useState(() => loadJSON(STORAGE_KEYS.currency, 'USD'))
  const [user, setUser] = useState(() => loadJSON(STORAGE_KEYS.user, null))
  const [orders, setOrders] = useState(() => loadJSON(STORAGE_KEYS.orders, []))
  const [toasts, setToasts] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [siteData, setSiteData] = useState(loadSiteData)
  const [adminSession, setAdminSession] = useState(() => loadJSON(STORAGE_KEYS.admin, null))
  const [apiReady, setApiReady] = useState(false)
  const [apiOnline, setApiOnline] = useState(false)
  const [theme, setThemeState] = useState(getInitialTheme)
  const timerRef = useRef({})

  useEffect(() => {
    applyThemeClass(theme)
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    const value = next === 'dark' ? 'dark' : 'light'
    applyThemeClass(value)
    try {
      localStorage.setItem(STORAGE_KEYS.theme, value)
    } catch {
      /* ignore */
    }
    setThemeState(value)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const value = prev === 'dark' ? 'light' : 'dark'
      applyThemeClass(value)
      try {
        localStorage.setItem(STORAGE_KEYS.theme, value)
      } catch {
        /* ignore */
      }
      return value
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.compare, JSON.stringify(compare))
  }, [compare])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currency, JSON.stringify(currency))
  }, [currency])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  }, [user])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders))
  }, [orders])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.siteData, JSON.stringify(siteData))
  }, [siteData])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.admin, JSON.stringify(adminSession))
  }, [adminSession])
  useEffect(() => {
    updateCatalog(siteData)
  }, [siteData])
  useEffect(() => {
    const root = document.documentElement
    const brand = siteData.settings.brandColor
    const accent = siteData.settings.accentColor
    const brandColor = ['#3f6eee', '#3F6EEE'].includes(brand) ? '#e04418' : (brand || '#e04418')
    const accentColor = ['#a855f7', '#A855F7'].includes(accent) ? '#0f2137' : (accent || '#0f2137')
    root.style.setProperty('--mc-brand', brandColor)
    root.style.setProperty('--mc-accent', accentColor)
  }, [siteData.settings])

  useEffect(() => {
    const lng = i18n.language || 'en'
    const dir = LANGUAGE_META[lng]?.dir || 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lng
  }, [i18n.language])

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, message, type }])
    timerRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  const dismissToast = (id) => {
    clearTimeout(timerRef.current[id])
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }

  const refreshCatalog = useCallback(async () => {
    try {
      const data = await api.catalog()
      if (!Array.isArray(data?.products)) {
        throw new Error('Invalid catalog payload')
      }
      let sellers = Array.isArray(data.sellers) ? data.sellers : null
      const token = getStoredToken()
      if (token) {
        try {
          const me = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null')
          if (me?.role === 'admin' || me?.role === 'manager') {
            const adminSellers = await api.adminSellers()
            if (Array.isArray(adminSellers?.sellers)) sellers = adminSellers.sellers
          }
        } catch {
          /* keep public sellers */
        }
      }
      const products = data.products.map((p) => ({ ...p, active: p.active !== false }))
      const categories = Array.isArray(data.categories) ? data.categories : []
      const brands = Array.isArray(data.brands) ? data.brands : []
      const coupons = Array.isArray(data.coupons)
        ? data.coupons.map((c) => ({ ...c, discount: c.discount ?? c.value }))
        : null
      setSiteData((prev) => ({
        ...prev,
        products,
        sellers: sellers || prev.sellers,
        categories: categories.length ? categories : prev.categories,
        brands: brands.length ? brands : prev.brands,
        coupons: coupons?.length ? coupons : prev.coupons,
        settings: { ...prev.settings, ...(data.settings || {}) },
        payments: data.payments || prev.payments,
        shippingMethods: data.shippingMethods || prev.shippingMethods
      }))
      setApiOnline(true)
      return true
    } catch (err) {
      console.warn('API catalog unavailable, using local data', err.message)
      setApiOnline(false)
      return false
    } finally {
      setApiReady(true)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await refreshCatalog()
      if (cancelled) return
      const token = getStoredToken()
      if (!token) return
      try {
        const { user: me } = await api.me()
        if (!cancelled) setUser(me)
        if (me && (me.role === 'admin' || me.role === 'manager')) {
          setAdminSession({
            username: me.email,
            name: me.name,
            role: me.role === 'admin' ? 'superadmin' : 'manager',
            loginAt: new Date().toISOString()
          })
        }
        try {
          const { orders: remoteOrders } = await api.myOrders()
          if (!cancelled && remoteOrders?.length) setOrders(remoteOrders)
        } catch {
          /* ignore */
        }
      } catch {
        setToken(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshCatalog])

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === product.id)
      if (existing) {
        return prev.map((x) => (x.id === product.id ? { ...x, qty: x.qty + qty } : x))
      }
      return [...prev, { id: product.id, product, qty }]
    })
    toast(t('notif.addedToCart'))
    setCartOpen(true)
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => x.id !== id))
    toast(t('notif.removedFromCart'), 'info')
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty } : x)))
  }

  const clearCart = () => {
    setCart([])
    toast(t('notif.cartCleared'), 'info')
  }

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((x) => x.id === product.id)
      if (exists) {
        toast(t('notif.removedFromWishlist'), 'info')
        return prev.filter((x) => x.id !== product.id)
      }
      toast(t('notif.addedToWishlist'))
      return [...prev, product]
    })
  }

  const toggleCompare = (product) => {
    setCompare((prev) => {
      const exists = prev.some((x) => x.id === product.id)
      if (exists) return prev.filter((x) => x.id !== product.id)
      const max = siteData.settings.maxCompare || 4
      if (prev.length >= max) return prev
      return [...prev, product]
    })
  }

  const activeCurrencies = siteData.currencies.filter((c) => c.enabled)
  const formatPrice = (value, withSymbol = true) => {
    const cfg = activeCurrencies.find((c) => c.code === currency) || CURRENCIES[currency] || CURRENCIES.USD
    const converted = (value * cfg.rate).toLocaleString('en-US', {
      minimumFractionDigits: cfg.rate >= 100 ? 0 : 2,
      maximumFractionDigits: cfg.rate >= 100 ? 0 : 2
    })
    return withSymbol ? `${cfg.symbol}${converted}` : `${converted}`
  }

  const setLanguage = (lng) => {
    i18n.changeLanguage(lng)
    document.documentElement.dir = LANGUAGE_META[lng]?.dir || 'ltr'
    document.documentElement.lang = lng
    toast(t('notif.languageChanged'), 'info')
  }

  const cartCount = cart.reduce((s, x) => s + x.qty, 0)
  const cartSubtotal = cart.reduce((s, x) => s + x.product.price * x.qty, 0)

  const login = async ({ email, password, name }) => {
    const normalized = (email || '').toLowerCase().trim()
    if (!password) {
      const u = { name: name || normalized, email: normalized }
      setUser(u)
      toast(t('notif.welcome').replace(/Lumina Market|Ciar VIP/g, t('brand')))
      return u
    }

    try {
      const { token, user: u } = await api.login({ email: normalized, password })
      setToken(token)
      setUser(u)
      setApiOnline(true)
      try {
        const { orders: remoteOrders } = await api.myOrders()
        setOrders(remoteOrders || [])
      } catch {
        /* ignore */
      }
      toast(t('notif.welcome').replace(/Lumina Market|Ciar VIP/g, t('brand')))
      return u
    } catch (err) {
      const accounts = loadLocalAccounts()
      const account = accounts.find((a) => a.email === normalized && a.password === password)
      if (!account) {
        throw new Error(err.message || t('auth.invalidCredentials'))
      }
      const u = makeLocalUser(account)
      setToken(`local-${u.id}`)
      setUser(u)
      toast(t('notif.welcome').replace(/Lumina Market|Ciar VIP/g, t('brand')))
      return u
    }
  }

  const register = async ({ name, email, password, phone }) => {
    const normalized = (email || '').toLowerCase().trim()
    try {
      const { token, user: u } = await api.register({ name, email: normalized, password, phone })
      setToken(token)
      setUser(u)
      setApiOnline(true)
      toast(t('notif.welcome').replace(/Lumina Market|Ciar VIP/g, t('brand')))
      return u
    } catch (err) {
      if (!isApiUnavailable(err)) {
        throw new Error(err.status === 409 ? t('auth.emailTaken') : err.message)
      }
      const accounts = loadLocalAccounts()
      if (accounts.some((a) => a.email === normalized)) {
        throw new Error(t('auth.emailTaken'))
      }
      const account = { name, email: normalized, password, phone: phone || '' }
      saveLocalAccounts([...accounts, account])
      const u = makeLocalUser(account)
      setToken(`local-${u.id}`)
      setUser(u)
      toast(t('notif.welcome').replace(/Lumina Market|Ciar VIP/g, t('brand')))
      return u
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setAdminSession(null)
    window.location.href = '/'
  }

  const placeOrder = async (checkoutData) => {
    const payload = {
      email: checkoutData.email,
      paymentMethod: checkoutData.payment === 'card' ? 'card' : 'cod',
      deliveryMethod: checkoutData.delivery || 'standard',
      currency,
      couponCode: checkoutData.couponCode,
      address: {
        firstName: checkoutData.address?.firstName || checkoutData.firstName,
        lastName: checkoutData.address?.lastName || checkoutData.lastName,
        line1: checkoutData.address?.address || checkoutData.address?.line1 || checkoutData.address,
        city: checkoutData.address?.city || checkoutData.city,
        state: checkoutData.address?.state || checkoutData.state || '',
        zip: checkoutData.address?.zip || checkoutData.zip,
        country: checkoutData.address?.country || checkoutData.country,
        phone: checkoutData.address?.phone || checkoutData.phone || ''
      },
      items: cart.map((c) => ({ productId: c.id, qty: c.qty }))
    }

    if (!apiOnline) {
      const order = {
        id: `LM-${Date.now().toString().slice(-6)}`,
        items: cart,
        subtotal: cartSubtotal,
        ...checkoutData,
        status: 'confirmed',
        date: new Date().toISOString()
      }
      setOrders((prev) => [order, ...prev])
      setCart([])
      return { order, checkoutUrl: null }
    }

    const result = await api.checkout(payload)
    setOrders((prev) => [result.order, ...prev])
    if (!result.checkoutUrl) setCart([])
    await refreshCatalog()
    return result
  }

  const updateOrder = (id, patch) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  const pushNotification = (notif) => {
    setSiteData((prev) => ({
      ...prev,
      notifications: [
        { id: `n${Date.now()}`, read: false, date: new Date().toISOString().slice(0, 10), ...notif },
        ...prev.notifications
      ]
    }))
  }

  const updateSite = (updater) => {
    setSiteData((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }

  const resetSiteData = () => {
    setSiteData(defaultSiteData)
    refreshCatalog()
  }

  const adminLogin = async (username, password) => {
    const raw = username.trim()
    const emailMap = {
      admin: 'admin@lumina.market',
      manager: 'manager@lumina.market'
    }
    const email = emailMap[raw.toLowerCase()] || (raw.includes('@') ? raw : null)

    const loginLocal = () => {
      const aliases = {
        admin: 'admin',
        manager: 'manager',
        'admin@lumina.market': 'admin',
        'manager@lumina.market': 'manager'
      }
      const key = aliases[raw.toLowerCase()] || raw.toLowerCase()
      const account = (siteData.adminUsers || []).find(
        (a) => a.username.toLowerCase() === key && a.password === password
      )
      if (!account) return false
      setAdminSession({
        username: account.username,
        name: account.name,
        role: account.role,
        loginAt: new Date().toISOString(),
        local: true
      })
      setUser({
        id: account.id,
        name: account.name,
        email: emailMap[account.username] || `${account.username}@lumina.market`,
        role: account.role === 'superadmin' ? 'admin' : account.role
      })
      return true
    }

    if (email) {
      try {
        const { token, user: u } = await api.login({ email, password })
        if (u.role !== 'admin' && u.role !== 'manager') {
          setToken(null)
          return false
        }
        setToken(token)
        setUser(u)
        setAdminSession({
          username: u.email,
          name: u.name,
          role: u.role === 'admin' ? 'superadmin' : 'manager',
          loginAt: new Date().toISOString()
        })
        try {
          const overview = await api.adminOverview()
          const [productsRes, sellersRes, ordersRes, usersRes] = await Promise.all([
            api.adminProducts(),
            api.adminSellers(),
            api.adminOrders(),
            api.adminUsers()
          ])
          setSiteData((prev) => ({
            ...prev,
            products: productsRes.products,
            sellers: sellersRes.sellers,
            users: usersRes.users,
            notifications: [
              {
                id: `n-admin-${Date.now()}`,
                title: 'Admin signed in',
                text: `${overview.stats.pendingSellers} pending seller applications`,
                type: 'seller',
                read: false,
                date: new Date().toISOString().slice(0, 10)
              },
              ...prev.notifications
            ]
          }))
          setOrders(ordersRes.orders || [])
        } catch {
          /* ignore sync errors */
        }
        return true
      } catch (err) {
        if (err.status === 401) return false
      }
    }

    return loginLocal()
  }

  const adminLogout = () => {
    setAdminSession(null)
    if (user?.role === 'admin' || user?.role === 'manager') {
      setToken(null)
      setUser(null)
    }
  }

  const products = (siteData.products || []).filter((p) => p.active !== false)
  const activeLanguages = (siteData.languages || []).filter((l) => l.enabled)

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      wishlist,
      toggleWishlist,
      compare,
      toggleCompare,
      currency,
      setCurrency,
      formatPrice,
      language: i18n.language,
      setLanguage,
      toasts,
      dismissToast,
      toast,
      user,
      login,
      register,
      logout,
      orders,
      placeOrder,
      updateOrder,
      isInWishlist: (id) => wishlist.some((x) => x.id === id),
      isInCompare: (id) => compare.some((x) => x.id === id),
      siteData,
      updateSite,
      resetSiteData,
      pushNotification,
      products,
      categories: siteData.categories,
      brands: siteData.brands,
      sellers: siteData.sellers,
      coupons: siteData.coupons,
      content: siteData.content,
      testimonials: siteData.content.testimonials,
      settings: siteData.settings,
      activeLanguages,
      activeCurrencies,
      payments: siteData.payments,
      shippingMethods: siteData.shippingMethods,
      users: siteData.users,
      reviews: siteData.reviews,
      tickets: siteData.tickets,
      notifications: siteData.notifications,
      adminUsers: siteData.adminUsers,
      emailTemplates: siteData.emailTemplates,
      adminSession,
      adminLogin,
      adminLogout,
      apiReady,
      apiOnline,
      refreshCatalog,
      theme,
      setTheme,
      toggleTheme
    }),
    [
      cart,
      cartCount,
      cartSubtotal,
      cartOpen,
      wishlist,
      compare,
      currency,
      toasts,
      user,
      orders,
      i18n.language,
      toast,
      siteData,
      products,
      activeLanguages,
      activeCurrencies,
      adminSession,
      apiReady,
      apiOnline,
      refreshCatalog,
      theme,
      setTheme,
      toggleTheme
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
