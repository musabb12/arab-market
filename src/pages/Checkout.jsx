import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { COUNTRIES } from '../utils/helpers.js'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

export default function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, cartSubtotal, formatPrice, placeOrder, settings, shippingMethods, payments, user, apiOnline } = useStore()

  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: COUNTRIES[0],
    phone: '',
    delivery: 'standard',
    payment: 'cod',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const stdMethod = shippingMethods.find((m) => m.id === 'standard') || { fee: 0 }
  const exprMethod = shippingMethods.find((m) => m.id === 'express') || { fee: 19.95 }
  const deliveryFee = form.delivery === 'express' ? exprMethod.fee : stdMethod.fee
  const tax = (cartSubtotal + deliveryFee) * (settings.taxRate / 100)
  const total = cartSubtotal + deliveryFee + tax

  if (cart.length === 0 && step === 1) {
    return (
      <div>
        <PageHero title={t('checkout.title')} crumb={t('cart.checkout')}  theme="checkout" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h3 className="font-display text-2xl font-semibold text-midnight-900 mb-4">{t('cart.empty')}</h3>
          <Link to="/products" className="text-brand-600 font-semibold hover:underline">{t('cart.startShopping')}</Link>
        </div>
      </div>
    )
  }

  const validContact = form.email && form.firstName && form.lastName && form.address && form.city && form.zip
  const validPayment = form.payment === 'cod' || form.payment === 'card'

  const submit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const result = await placeOrder({
        email: form.email,
        address: { ...form },
        delivery: form.delivery,
        payment: form.payment,
        total
      })
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
        return
      }
      navigate(`/order-confirmation?id=${result.order.id}`)
    } catch (err) {
      setError(err.message || 'Checkout failed')
    } finally {
      setSubmitting(false)
    }
  }

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors'
  const label = 'block text-xs font-semibold text-slate-500 mb-1.5'

  return (
    <div>
      <PageHero title={t('checkout.title')} crumb={t('cart.checkout')}  theme="checkout" />
      <Breadcrumb items={[{ label: t('checkout.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step >= s ? 'text-brand-600' : 'text-slate-400'}`}>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= s ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>
                    {step > s ? <Icon name="check" size={15} /> : s}
                  </span>
                  <span className="text-sm font-semibold">{s === 1 ? t('checkout.shippingAddress') : t('checkout.payment')}</span>
                </div>
                {s === 1 && <span className="flex-1 h-px bg-slate-200" />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 space-y-6">
              <div>
                <h3 className="font-bold text-midnight-900 mb-4">{t('checkout.contactInfo')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={label}>{t('checkout.email')}</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={input} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-midnight-900 mb-4">{t('checkout.shippingAddress')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={label}>{t('checkout.firstName')}</label><input value={form.firstName} onChange={set('firstName')} className={input} /></div>
                  <div><label className={label}>{t('checkout.lastName')}</label><input value={form.lastName} onChange={set('lastName')} className={input} /></div>
                  <div className="sm:col-span-2"><label className={label}>{t('checkout.address')}</label><input value={form.address} onChange={set('address')} className={input} /></div>
                  <div><label className={label}>{t('checkout.city')}</label><input value={form.city} onChange={set('city')} className={input} /></div>
                  <div><label className={label}>{t('checkout.state')}</label><input value={form.state} onChange={set('state')} className={input} /></div>
                  <div><label className={label}>{t('checkout.zip')}</label><input value={form.zip} onChange={set('zip')} className={input} /></div>
                  <div><label className={label}>{t('checkout.country')}</label>
                    <select value={form.country} onChange={set('country')} className={input}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="sm:col-span-2"><label className={label}>{t('checkout.phone')}</label><input value={form.phone} onChange={set('phone')} className={input} /></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-midnight-900 mb-4">{t('checkout.deliveryMethod')}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={() => setForm((f) => ({ ...f, delivery: 'standard' }))} className={`text-left p-5 rounded-2xl border-2 transition-all ${form.delivery === 'standard' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <Icon name="truck" size={22} className="text-brand-600 mb-2" />
                    <p className="text-sm font-bold text-midnight-900">{t('checkout.standard')}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatPrice(stdMethod.fee)}</p>
                  </button>
                  <button onClick={() => setForm((f) => ({ ...f, delivery: 'express' }))} className={`text-left p-5 rounded-2xl border-2 transition-all ${form.delivery === 'express' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <Icon name="zap" size={22} className="text-brand-600 mb-2" />
                    <p className="text-sm font-bold text-midnight-900">{t('checkout.express')}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatPrice(exprMethod.fee)}</p>
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setStep(2)} disabled={!validContact} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold disabled:opacity-40 hover:shadow-glow transition-all flex items-center gap-2">
                  {t('common.more')} <Icon name="arrowRight" size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
              <h3 className="font-bold text-midnight-900 mb-4">{t('checkout.payment')}</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {payments.filter((p) => p.enabled).map((p) => (
                  <button key={p.id} onClick={() => setForm((f) => ({ ...f, payment: p.id }))} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${form.payment === p.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <Icon name={p.id === 'cod' ? 'wallet' : 'creditCard'} size={22} className="text-brand-600" />
                    <span className="text-sm font-semibold text-midnight-900">{p.id === 'cod' ? t('checkout.cashOnDelivery') : p.id === 'card' ? t('checkout.card') : p.name}</span>
                  </button>
                ))}
              </div>

              {form.payment === 'card' && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 mb-2">
                  {apiOnline
                    ? 'You will complete card payment securely on Stripe Checkout.'
                    : 'Card payments require the API server and STRIPE_SECRET_KEY.'}
                </div>
              )}

              {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

              <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-5">
                <Icon name="lock" size={12} /> {t('checkout.secureNotice')}
              </p>

              <div className="flex justify-between items-center mt-6">
                <button onClick={() => setStep(1)} className="text-sm font-semibold text-slate-500 hover:text-midnight-900 transition-colors flex items-center gap-1">
                  <Icon name="arrowRight" size={14} className="rotate-180" />
                  {t('checkout.backToCart')}
                </button>
                <button onClick={submit} disabled={!validPayment || submitting} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold disabled:opacity-40 hover:shadow-glow transition-all">
                  {submitting ? '...' : t('checkout.placeOrder')}
                </button>
              </div>
            </motion.div>
          )}

          <p className="text-xs text-slate-400 px-2">{t('checkout.terms')}</p>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-36 bg-white rounded-3xl border border-slate-100 shadow-soft p-6">
          <h3 className="font-bold text-midnight-900 mb-5">{t('checkout.orderSummary')}</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-midnight-900 text-white text-[10px] font-bold">{item.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-600">{getBrand(item.product.brand).name}</p>
                  <p className="text-sm font-medium text-midnight-900 line-clamp-1">{item.product.name}</p>
                </div>
                <span className="text-sm font-semibold text-midnight-900">{formatPrice(item.product.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-5 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{t('cart.subtotal')}</span><span className="font-semibold">{formatPrice(cartSubtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t('cart.shipping')}</span><span className="font-semibold">{form.delivery === 'express' ? formatPrice(deliveryFee) : t('cart.shippingFree')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t('cart.tax')}</span><span className="font-semibold">{formatPrice(tax)}</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-3">
              <span className="font-semibold text-midnight-900">{t('cart.grandTotal')}</span>
              <span className="text-xl font-bold text-midnight-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
