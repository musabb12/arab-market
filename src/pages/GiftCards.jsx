import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

const amounts = [25, 50, 100, 150, 250, 500]
const designs = [
  { id: 'gold', label: 'Aurum', gradient: 'bg-amber-500' },
  { id: 'noir', label: 'Noir', gradient: 'bg-slate-800' },
  { id: 'rose', label: 'Rosé', gradient: 'bg-rose-400' },
  { id: 'sapphire', label: 'Sapphire', gradient: 'bg-midnight-700' }
]

export default function GiftCards() {
  const { t } = useTranslation()
  const { addToCart, formatPrice } = useStore()
  const [amount, setAmount] = useState(50)
  const [design, setDesign] = useState('gold')
  const [recipient, setRecipient] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [delivery, setDelivery] = useState('email')

  const current = designs.find((d) => d.id === design)
  const giftProduct = {
    id: 'gift-card',
    name: `${t('gifts.title')} - $${amount}`,
    brand: 'ciar-gallery',
    category: 'accessories',
    price: amount,
    rating: 5,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80',
    description: `${t('gifts.title')} $${amount}`
  }

  const features = [
    { icon: 'zap', text: t('gifts.feature1') },
    { icon: 'refresh', text: t('gifts.feature2') },
    { icon: 'box', text: t('gifts.feature3') },
    { icon: 'sparkle', text: t('gifts.feature4') }
  ]

  return (
    <div>
      <PageHero title={t('gifts.title')} subtitle={t('gifts.subtitle')} crumb={t('gifts.title')}  theme="gifts" />
      <Breadcrumb items={[{ label: t('gifts.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-10">
        {/* Customizer */}
        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-bold text-midnight-900 uppercase tracking-wider mb-4">{t('gifts.amountTitle')}</h3>
            <div className="flex flex-wrap gap-3">
              {amounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`px-6 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${amount === a ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  ${a}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-midnight-900 uppercase tracking-wider mb-4">{t('gifts.designTitle')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {designs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDesign(d.id)}
                  className={`rounded-2xl p-2 border-2 transition-all ${design === d.id ? 'border-brand-600' : 'border-transparent hover:border-slate-200'}`}
                >
                  <span className={`flex h-20 items-center justify-center rounded-xl ${d.gradient} text-white font-semibold text-xs uppercase tracking-widest`}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-midnight-900 uppercase tracking-wider mb-4">{t('gifts.personalTitle')}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('gifts.recipient')}</label>
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors" placeholder={t('gifts.recipient')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('gifts.from')}</label>
                <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors" placeholder={t('gifts.from')} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('gifts.message')}</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors resize-none" placeholder={t('gifts.messagePlaceholder')} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-midnight-900 uppercase tracking-wider mb-4">{t('gifts.deliveryTitle')}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button onClick={() => setDelivery('email')} className={`text-left p-5 rounded-2xl border-2 transition-all ${delivery === 'email' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <Icon name="mail" size={22} className="text-brand-600 mb-2" />
                <p className="text-sm font-bold text-midnight-900">{t('gifts.emailDelivery')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('gifts.emailDeliveryText')}</p>
              </button>
              <button onClick={() => setDelivery('physical')} className={`text-left p-5 rounded-2xl border-2 transition-all ${delivery === 'physical' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <Icon name="box" size={22} className="text-brand-600 mb-2" />
                <p className="text-sm font-bold text-midnight-900">{t('gifts.physicalDelivery')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('gifts.physicalDeliveryText')}</p>
              </button>
            </div>
          </section>
        </div>

        {/* Preview + checkout */}
        <div>
          <div className="sticky top-36 space-y-6">
            <motion.div
              key={`${amount}-${design}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden ${current.gradient} shadow-lift`}
            >
              <div className="absolute inset-3 border border-white/40 rounded-2xl" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <Icon name="sparkle" size={28} className="text-white/90 mb-4" />
                <p className="text-white font-display text-2xl font-semibold mb-1">Ciar VIP</p>
                <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-6">Gift Card</p>
                <p className="text-white text-4xl md:text-5xl font-bold">{formatPrice(amount)}</p>
                {recipient && <p className="text-white/90 text-sm mt-6">For {recipient}</p>}
                {from && <p className="text-white/60 text-xs mt-1">From {from}</p>}
              </div>
            </motion.div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">{t('gifts.price')}</span>
                <span className="text-2xl font-bold text-midnight-900">{formatPrice(amount)}</span>
              </div>
              <button
                onClick={() => addToCart(giftProduct)}
                className="w-full py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Icon name="cart" size={18} />
                {t('gifts.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="font-display text-2xl font-semibold text-midnight-900 text-center mb-8">{t('gifts.featuresTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.text} className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-3">
                <Icon name={f.icon} size={22} />
              </span>
              <p className="text-sm font-semibold text-midnight-900">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
