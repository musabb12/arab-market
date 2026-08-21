import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { formatDate } from '../utils/helpers.js'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

const steps = [
  { key: 'confirmed', icon: 'check' },
  { key: 'processing', icon: 'box' },
  { key: 'shipped', icon: 'truck' },
  { key: 'delivered', icon: 'home' }
]

const progress = { confirmed: 1, processing: 2, shipped: 3, delivered: 4 }

export default function TrackOrder() {
  const { t } = useTranslation()
  const { orders, formatPrice } = useStore()
  const [params] = useSearchParams()
  const [input, setInput] = useState(params.get('order') || '')
  const [found, setFound] = useState(null)
  const [searched, setSearched] = useState(false)

  const search = (e) => {
    e.preventDefault()
    const order = orders.find((o) => o.id.toLowerCase() === input.trim().toLowerCase())
    setFound(order || null)
    setSearched(true)
  }

  useEffect(() => {
    if (params.get('order')) {
      const order = orders.find((o) => o.id === params.get('order'))
      setFound(order || null)
      setSearched(true)
    }
  }, [params])

  const currentStep = found ? progress[found.status] || 1 : 1

  return (
    <div>
      <PageHero title={t('tracking.title')} subtitle={t('tracking.subtitle')} crumb={t('nav.trackOrder')} />
      <Breadcrumb items={[{ label: t('tracking.title') }]} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={search} className="flex gap-3 mb-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('tracking.placeholder')}
            className="flex-1 border border-slate-200 rounded-2xl px-6 py-4 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
          />
          <button type="submit" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold flex items-center gap-2 hover:shadow-glow transition-all">
            <Icon name="truck" size={18} />
            {t('tracking.track')}
          </button>
        </form>

        {searched && !found && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-10 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4">
              <Icon name="info" size={28} />
            </span>
            <h3 className="font-display text-xl font-semibold text-midnight-900 mb-2">{t('tracking.notFound')}</h3>
            <p className="text-sm text-slate-500">{t('tracking.checkEmail')}</p>
          </div>
        )}

        {found && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-50 grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('order.orderNumber')}</p>
                <p className="font-bold text-midnight-900">{found.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('order.orderDate')}</p>
                <p className="font-semibold text-midnight-900 text-sm">{formatDate(found.date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('orders.status')}</p>
                <p className="font-semibold text-brand-600 text-sm">{t(`tracking.status${found.status.charAt(0).toUpperCase()}${found.status.slice(1)}`)}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8">
              <div className="flex items-center mb-10">
                {steps.map((s, i) => (
                  <React.Fragment key={s.key}>
                    <div className="flex flex-col items-center relative z-10">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-colors ${i < currentStep ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                        <Icon name={s.icon} size={18} />
                      </span>
                      <span className={`text-[11px] font-semibold mt-2 absolute top-14 whitespace-nowrap ${i < currentStep ? 'text-brand-600' : 'text-slate-400'}`}>
                        {t(`tracking.status${s.key.charAt(0).toUpperCase()}${s.key.slice(1)}`)}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-1.5 rounded-full mx-2 ${i < currentStep - 1 ? 'bg-brand-600' : 'bg-slate-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-sm text-slate-500 text-center pt-8">{t(`tracking.${found.status}Text`)}</p>
            </div>

            <div className="p-6 border-t border-slate-50 bg-slate-50/50">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('tracking.carrier')}</p>
                  <p className="font-semibold text-midnight-900">{t('tracking.carrierFedex')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('tracking.trackingNumber')}</p>
                  <p className="font-semibold text-midnight-900">LX{found.id.replace('LM-', '')}-{Math.abs(found.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0))}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">{t('tracking.deliveryDate')}</p>
                  <p className="font-semibold text-midnight-900">{formatDate(new Date(Date.now() + (found.delivery === 'express' ? 3 : 7) * 86400000).toISOString())}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4 space-y-3">
                {found.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-600">{getBrand(item.product.brand).name}</p>
                      <p className="text-sm text-midnight-900 line-clamp-1">{item.product.name}</p>
                    </div>
                    <span className="text-sm font-semibold text-midnight-900">x{item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Link to="/help" className="text-sm font-semibold text-brand-600 hover:underline">{t('help.contactSupport')}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
