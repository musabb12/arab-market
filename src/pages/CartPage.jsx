import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, EmptyState } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

export default function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, updateQty, removeFromCart, cartSubtotal, formatPrice, toast, coupons, settings } = useStore()
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(null)

  const shipping = cartSubtotal >= settings.freeShippingThreshold || cart.length === 0 ? 0 : settings.shippingFee
  const discount = applied ? (cartSubtotal * applied.discount) / 100 : 0
  const tax = cart.length > 0 ? (cartSubtotal - discount) * (settings.taxRate / 100) : 0
  const total = cartSubtotal - discount + shipping + tax

  const applyCoupon = (e) => {
    e.preventDefault()
    const found = coupons.find((c) => c.code.toUpperCase() === coupon.trim().toUpperCase())
    if (found) {
      setApplied(found)
      toast(t('notif.couponApplied'))
    } else {
      setApplied(null)
      toast(t('notif.couponInvalid'), 'error')
    }
  }

  return (
    <div>
      <PageHero title={t('cart.title')} crumb={t('nav.cart')} />
      <Breadcrumb items={[{ label: t('cart.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft">
            <EmptyState
              icon="cart"
              title={t('cart.empty')}
              subtitle={t('cart.emptySub')}
              action={
                <Link to="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">
                  {t('cart.startShopping')}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Items */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="hidden sm:grid grid-cols-[1fr_100px_90px_90px_40px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>{t('cart.item')}</span>
                <span className="text-center">{t('cart.price')}</span>
                <span className="text-center">{t('cart.quantity')}</span>
                <span className="text-center">{t('cart.total')}</span>
                <span />
              </div>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-5 border-b border-slate-50 grid sm:grid-cols-[1fr_100px_90px_90px_40px] gap-4 items-center"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                    </Link>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">{getBrand(item.product.brand).name}</p>
                      <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-midnight-900 line-clamp-2 hover:text-brand-600 transition-colors">{item.product.name}</Link>
                      <p className="text-xs text-slate-400 mt-1">{t('common.inStock')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 hidden sm:block text-center">{formatPrice(item.product.price)}</span>
                  <div className="flex items-center justify-center border border-slate-200 rounded-full mx-auto">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-slate-500 hover:text-midnight-900" aria-label="Decrease"><Icon name="minus" size={13} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-slate-500 hover:text-midnight-900" aria-label="Increase"><Icon name="plus" size={13} /></button>
                  </div>
                  <span className="font-bold text-midnight-900 hidden sm:block text-center">{formatPrice(item.product.price * item.qty)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-600 transition-colors justify-self-center" aria-label="Remove">
                    <Icon name="trash" size={17} />
                  </button>
                </motion.div>
              ))}
              <div className="px-6 py-4 flex justify-between">
                <Link to="/products" className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1">
                  <Icon name="arrowRight" size={14} className="rotate-180" />
                  {t('cart.continueShopping')}
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-5 lg:sticky lg:top-36">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                <h3 className="font-bold text-midnight-900 mb-4">{t('cart.title')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">{t('cart.subtotal')}</span><span className="font-semibold text-midnight-900">{formatPrice(cartSubtotal)}</span></div>
                  {applied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>{t('cart.coupon')} ({applied.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="text-slate-500">{t('cart.shipping')}</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-midnight-900'}`}>{shipping === 0 ? t('cart.shippingFree') : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-500">{t('cart.tax')}</span><span className="font-semibold text-midnight-900">{formatPrice(tax)}</span></div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-semibold text-midnight-900">{t('cart.grandTotal')}</span>
                    <span className="text-xl font-bold text-midnight-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {cartSubtotal < settings.freeShippingThreshold && (
                  <div className="mt-4 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    {t('common.freeShipping')}: {formatPrice(settings.freeShippingThreshold - cartSubtotal)} to unlock
                  </div>
                )}

                <button onClick={() => navigate('/checkout')} className="mt-5 w-full py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all">
                  {t('cart.checkout')}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-3">
                  <Icon name="lock" size={12} />
                  {t('cart.secure')}
                </p>
              </div>

              <form onSubmit={applyCoupon} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
                <h3 className="font-bold text-midnight-900 mb-3">{t('cart.coupon')}</h3>
                <div className="flex gap-2">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder={t('cart.couponPlaceholder')} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 uppercase" />
                  <button type="submit" className="px-5 py-3 rounded-xl bg-midnight-900 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">{t('cart.apply')}</button>
                </div>
                {applied && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><Icon name="check" size={12} />{t('cart.applied')}</p>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
