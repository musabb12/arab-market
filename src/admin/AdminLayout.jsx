import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_META } from '../i18n/index.js'

const GROUPS = [
  {
    labelKey: 'admin.groups.overview',
    items: [
      { to: '/admin/dashboard', icon: 'home', labelKey: 'admin.nav.dashboard' },
      { to: '/admin/analytics', icon: 'chart', labelKey: 'admin.nav.analytics' }
    ]
  },
  {
    labelKey: 'admin.groups.catalog',
    items: [
      { to: '/admin/products', icon: 'box', labelKey: 'admin.nav.products' },
      { to: '/admin/categories', icon: 'tag', labelKey: 'admin.nav.categories' },
      { to: '/admin/brands', icon: 'sparkle', labelKey: 'admin.nav.brands' },
      { to: '/admin/reviews', icon: 'star', labelKey: 'admin.nav.reviews' }
    ]
  },
  {
    labelKey: 'admin.groups.sales',
    items: [
      { to: '/admin/orders', icon: 'cart', labelKey: 'admin.nav.orders' },
      { to: '/admin/coupons', icon: 'percent', labelKey: 'admin.nav.coupons' },
      { to: '/admin/promotions', icon: 'zap', labelKey: 'admin.nav.promotions' }
    ]
  },
  {
    labelKey: 'admin.groups.commerce',
    items: [
      { to: '/admin/sellers', icon: 'store', labelKey: 'admin.nav.sellers' },
      { to: '/admin/users', icon: 'user', labelKey: 'admin.nav.users' }
    ]
  },
  {
    labelKey: 'admin.groups.platform',
    items: [
      { to: '/admin/payments', icon: 'creditCard', labelKey: 'admin.nav.payments' },
      { to: '/admin/shipping', icon: 'truck', labelKey: 'admin.nav.shipping' }
    ]
  },
  {
    labelKey: 'admin.groups.localization',
    items: [
      { to: '/admin/languages', icon: 'globe', labelKey: 'admin.nav.languages' },
      { to: '/admin/currencies', icon: 'wallet', labelKey: 'admin.nav.currencies' }
    ]
  },
  {
    labelKey: 'admin.groups.design',
    items: [
      { to: '/admin/appearance', icon: 'settings', labelKey: 'admin.nav.appearance' },
      { to: '/admin/content', icon: 'document', labelKey: 'admin.nav.content' }
    ]
  },
  {
    labelKey: 'admin.groups.support',
    items: [
      { to: '/admin/tickets', icon: 'chat', labelKey: 'admin.nav.tickets' },
      { to: '/admin/notifications', icon: 'bell', labelKey: 'admin.nav.notifications' }
    ]
  },
  {
    labelKey: 'admin.groups.system',
    items: [
      { to: '/admin/admin-users', icon: 'shield', labelKey: 'admin.nav.adminUsers' },
      { to: '/admin/system', icon: 'lock', labelKey: 'admin.nav.system' }
    ]
  }
]

export default function AdminLayout() {
  const { adminSession, adminLogout, notifications, setLanguage } = useStore()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  if (!adminSession) {
    return <Navigate to="/admin/login" replace />
  }

  const unread = notifications.filter((n) => !n.read).length
  const roleKey = adminSession.role === 'superadmin' ? 'superadmin' : adminSession.role
  const roleLabel = t(`admin.roles.${roleKey}`, { defaultValue: adminSession.role })

  const Sidebar = (
    <div className="flex h-full flex-col bg-midnight-900">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600">
          <Icon name="shield" size={18} className="text-white" />
        </span>
        <div className="leading-tight">
          <p className="font-display font-bold text-white text-sm">{t('admin.brand')}</p>
          <p className="text-[10px] uppercase tracking-widest text-brand-300">{t('admin.controlCenter')}</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {GROUPS.map((g) => (
          <div key={g.labelKey}>
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{t(g.labelKey)}</p>
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive ? 'bg-brand-600/20 text-brand-200 font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon name={item.icon} size={17} />
                  <span>{t(item.labelKey)}</span>
                  {item.to === '/admin/notifications' && unread > 0 && (
                    <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">{unread}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
          <Icon name="store" size={17} />
          <span>{t('nav.home')}</span>
        </NavLink>
        <button
          onClick={() => { adminLogout(); navigate('/admin/login') }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <Icon name="logout" size={17} />
          <span>{t('admin.signOut')}</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 start-0 z-40">
        {Sidebar}
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72">{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 lg:ms-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="flex items-center gap-3 px-4 md:px-6 h-16">
            <button className="lg:hidden p-2 -ms-2 text-midnight-900" onClick={() => setOpen(true)} aria-label="Menu">
              <Icon name="menu" size={22} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Icon name="sparkle" size={15} className="text-brand-500" />
              <span className="hidden sm:inline font-medium text-slate-500">{t('brand')} Admin</span>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-midnight-800 hover:bg-slate-50 transition-colors"
                >
                  <Icon name="globe" size={14} />
                  <span>{LANGUAGE_META[i18n.language]?.flag || (i18n.language || 'en').toUpperCase()}</span>
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className="absolute end-0 top-full mt-2 z-50 w-44 rounded-xl border border-slate-100 bg-white shadow-lift py-1 overflow-hidden">
                      {['ar', 'en'].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setLanguage(code)
                            setLangOpen(false)
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                            i18n.language === code ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-400 w-6">{LANGUAGE_META[code]?.flag}</span>
                          {LANGUAGE_META[code]?.name || code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => navigate('/admin/notifications')}
                className="relative p-2.5 rounded-full hover:bg-slate-50 transition-colors"
                aria-label={t('admin.nav.notifications')}
              >
                <Icon name="bell" size={20} className="text-midnight-900" />
                {unread > 0 && (
                  <span className="absolute top-1 end-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
              </button>
              <div className="flex items-center gap-2.5 ps-2 border-s border-slate-100">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">
                  {adminSession.name?.[0] || adminSession.username?.[0] || 'A'}
                </span>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold text-midnight-900">{adminSession.name || adminSession.username}</p>
                  <p className="text-[11px] text-slate-400">{roleLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
