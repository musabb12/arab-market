import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

export function AccountNav({ active }) {
  const { t } = useTranslation()
  const items = [
    { key: 'overview', to: '/account', label: t('account.overview'), icon: 'home' },
    { key: 'orders', to: '/account/orders', label: t('account.orders'), icon: 'box' },
    { key: 'addresses', to: '/account/addresses', label: t('account.addresses'), icon: 'mapPin' },
    { key: 'settings', to: '/account/settings', label: t('account.settings'), icon: 'settings' },
    { key: 'wishlist', to: '/wishlist', label: t('account.wishlist'), icon: 'heart' },
    { key: 'payments', to: '/account/settings', label: t('account.payments'), icon: 'creditCard' },
    { key: 'support', to: '/help', label: t('account.support'), icon: 'headset' }
  ]
  return (
    <aside className="lg:w-64 shrink-0">
      <nav className="bg-white rounded-2xl border border-slate-100 shadow-soft p-3 space-y-1 sticky top-36">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active === item.key ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'}`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default function Account() {
  const { t } = useTranslation()
  const { user, orders, wishlist, formatPrice, logout } = useStore()

  const stats = [
    { icon: 'box', label: t('account.totalOrders'), value: orders.length, color: 'from-brand-500 to-indigo-600' },
    { icon: 'creditCard', label: t('account.totalSpent'), value: formatPrice(orders.reduce((s, o) => s + o.total, 0)), color: 'from-emerald-500 to-teal-600' },
    { icon: 'heart', label: t('account.wishlistCount'), value: wishlist.length, color: 'from-rose-500 to-pink-600' },
    { icon: 'sparkle', label: t('account.rewardsPoints'), value: (orders.length * 50).toLocaleString(), color: 'from-amber-500 to-orange-600' }
  ]

  return (
    <div>
      <PageHero title={t('account.title')} crumb={t('nav.account')} />
      <Breadcrumb items={[{ label: t('account.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <AccountNav active="overview" />

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-2xl font-bold">
                  {(user?.name?.[0] || 'G').toUpperCase()}
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-midnight-900">{user ? t('account.hello', { name: user.name }) : t('account.hello', { name: 'Guest' })}</h2>
                  <p className="text-sm text-slate-500">{user?.email || 'guest@example.com'} · {t('account.memberSince', { date: '2023' })}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/account/settings" className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-colors">
                  {t('account.editProfile')}
                </Link>
                <button onClick={logout} className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white mb-3`}>
                  <Icon name={s.icon} size={20} />
                </span>
                <p className="text-xl font-bold text-midnight-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-midnight-900">{t('account.orderHistory')}</h3>
              <Link to="/account/orders" className="text-sm font-semibold text-brand-600 hover:underline">{t('account.viewAll')}</Link>
            </div>
            {orders.length === 0 ? (
              <div className="p-10 text-center">
                <Icon name="box" size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">{t('orders.empty')}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-midnight-900">{o.id}</p>
                      <p className="text-xs text-slate-400">{formatDate(o.date)} · {o.items.length} {t('orders.items')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-midnight-900">{formatPrice(o.total)}</span>
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{t(`orders.status${o.status.charAt(0).toUpperCase()}${o.status.slice(1)}`)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
