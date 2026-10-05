import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { api } from '../api/client.js'
import { getBrand, formatDate } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

export default function OrderConfirmation() {
  const { t } = useTranslation()
  const { orders, formatPrice, clearCart } = useStore()
  const [params] = useSearchParams()
  const id = params.get('id')
  const sessionId = params.get('session_id')
  const [order, setOrder] = useState(() => orders.find((o) => o.id === id) || null)
  const [loading, setLoading] = useState(Boolean(sessionId || (id && !orders.find((o) => o.id === id))))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (sessionId) {
          const { order: remote } = await api.orderBySession(sessionId)
          if (!cancelled) {
            setOrder(remote)
            clearCart()
          }
        } else if (id && !order) {
          const { order: remote } = await api.getOrder(id)
          if (!cancelled) setOrder(remote)
        }
      } catch {
        /* keep local order if any */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, sessionId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-500">
        Loading order...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900 mb-4">{t('notFound.title')}</h2>
        <Link to="/" className="text-brand-600 font-semibold hover:underline">{t('notFound.home')}</Link>
      </div>
    )
  }

  const deliveryDate = new Date(Date.now() + (order.delivery === 'express' ? 3 : 7) * 86400000)

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 shadow-lift mb-6"
        >
          <Icon name="check" size={44} className="text-white" strokeWidth={2.4} />
        </motion.span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('order.confirmation')}</h1>
        <p className="text-slate-500 max-w-md mx-auto">{t('order.confirmationText')}</p>
      </motion.div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-50 border-b border-slate-50">
          <div className="p-5">
            <p className="text-xs text-slate-400 mb-1">{t('order.orderNumber')}</p>
            <p className="font-bold text-midnight-900 text-sm break-all">{order.id}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-400 mb-1">{t('order.orderDate')}</p>
            <p className="font-bold text-midnight-900 text-sm">{formatDate(order.date)}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-400 mb-1">{t('order.estimatedDelivery')}</p>
            <p className="font-bold text-midnight-900 text-sm">{formatDate(deliveryDate.toISOString())}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-slate-400 mb-1">{t('order.paid')}</p>
            <p className="font-bold text-emerald-600 text-sm">{formatPrice(order.total)}</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-midnight-900 mb-4">{t('order.details')}</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-600">{getBrand(item.product.brand).name}</p>
                  <p className="text-sm font-medium text-midnight-900">{item.product.name}</p>
                </div>
                <span className="text-sm text-slate-500">x{item.qty}</span>
                <span className="text-sm font-semibold text-midnight-900 w-20 text-right">{formatPrice(item.product.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/account/orders" className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-semibold">
          {t('account.orders')}
        </Link>
        <Link to="/products" className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900">
          {t('cart.startShopping')}
        </Link>
      </div>
    </div>
  )
}
