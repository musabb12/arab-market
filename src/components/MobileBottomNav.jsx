import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

export default function MobileBottomNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, cartCount, setCartOpen, settings } = useStore()
  const canBrowse = Boolean(user) || settings?.requireLogin === false

  const items = [
    { id: 'store', to: '/', icon: 'bag', label: t('mobileNav.store'), match: (p) => p === '/' },
    { id: 'categories', to: '/categories', icon: 'layoutGrid', label: t('mobileNav.categories'), match: (p) => p.startsWith('/categories') || p.startsWith('/category/') },
    { id: 'trends', to: canBrowse ? '/deals' : '/login', icon: 'megaphone', label: t('mobileNav.trends'), match: (p) => p.startsWith('/deals') || p.startsWith('/new-arrivals') || p.startsWith('/best-sellers'), badge: true, state: canBrowse ? undefined : { from: '/deals' } },
    {
      id: 'cart',
      icon: 'cart',
      label: t('mobileNav.bag'),
      match: (p) => p.startsWith('/cart'),
      onClick: () => {
        if (!canBrowse) {
          navigate('/login', { state: { from: '/cart' } })
          return
        }
        setCartOpen(true)
      }
    },
    {
      id: 'me',
      to: user ? '/account' : '/login',
      icon: 'user',
      label: t('mobileNav.me'),
      match: (p) => p.startsWith('/account') || p === '/login' || p === '/register'
    }
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white dark:bg-midnight-950 border-t border-slate-200 dark:border-white/10 pb-[env(safe-area-inset-bottom)]"
      style={{ height: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}
      aria-label="Mobile navigation"
    >
      <div className="h-14 grid grid-cols-5">
        {items.map((item) => {
          const active = item.match(pathname)
          const className = `relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
            active ? 'text-brand-600' : 'text-slate-500 dark:text-slate-400'
          }`
          const content = (
            <>
              <span className="relative">
                <Icon name={item.icon} size={22} strokeWidth={active ? 2.2 : 1.8} />
                {item.id === 'cart' && canBrowse && cartCount > 0 && (
                  <span className="absolute -top-1.5 -end-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
                {item.badge && !active && (
                  <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </span>
              <span className="leading-none">{item.label}</span>
              {active && <span className="absolute bottom-0 inset-x-4 h-0.5 rounded-full bg-brand-600" />}
            </>
          )
          if (item.onClick) {
            return (
              <button key={item.id} type="button" onClick={item.onClick} className={className}>
                {content}
              </button>
            )
          }
          return (
            <Link key={item.id} to={item.to} state={item.state} className={className}>
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
