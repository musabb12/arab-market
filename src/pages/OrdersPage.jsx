import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, EmptyState } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate } from '../utils/helpers.js'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'
import { AccountNav } from './Account.jsx'

export default function OrdersPage() {
  const { t } = useTranslation()
  const { orders, formatPrice } = useStore()

  return (
    <div>
      <PageHero title={t('orders.title')} crumb={t('nav.orders')} />
      <Breadcrumb items={[{ label: t('orders.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <AccountNav active="orders" />
        <div className="flex-1 min-w-0">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft">
              <EmptyState
                icon="box"
                title={t('orders.empty')}
                subtitle={t('orders.emptySub')}
                action={
                  <Link to="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">
                    {t('cart.startShopping')}
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <span><span className="text-xs text-slate-400 block">{t('orders.orderId')}</span><b className="text-midnight-900">{o.id}</b></span>
                      <span><span className="text-xs text-slate-400 block">{t('orders.date')}</span><b className="text-midnight-900">{formatDate(o.date)}</b></span>
                      <span><span className="text-xs text-slate-400 block">{t('orders.total')}</span><b className="text-midnight-900">{formatPrice(o.total)}</b></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        {t(`orders.status${o.status.charAt(0).toUpperCase()}${o.status.slice(1)}`)}
                      </span>
                      <Link to={`/track-order?order=${o.id}`} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                        <Icon name="truck" size={14} />
                        {t('orders.tracking')}
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {o.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-brand-600">{getBrand(item.product.brand).name}</p>
                            <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-midnight-900 line-clamp-1 hover:text-brand-600 transition-colors">{item.product.name}</Link>
                          </div>
                          <span className="text-sm text-slate-500">x{item.qty}</span>
                          <span className="text-sm font-semibold text-midnight-900 w-20 text-right">{formatPrice(item.product.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
                      <button className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-colors">
                        {t('orders.reorder')}
                      </button>
                      <Link to={`/track-order?order=${o.id}`} className="px-5 py-2.5 rounded-full bg-midnight-900 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
                        {t('orders.detail')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
