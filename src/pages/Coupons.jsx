import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { formatDate } from '../utils/helpers.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function Coupons() {
  const { t } = useTranslation()
  const { toast, coupons } = useStore()
  const [copied, setCopied] = useState(null)

  const copy = (code) => {
    navigator.clipboard?.writeText(code)
    setCopied(code)
    toast(t('deals.couponCopied'))
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <PageHero title={t('deals.couponTitle')} subtitle={t('deals.couponSubtitle')} crumb={t('deals.couponTitle')}  theme="coupons" />
      <Breadcrumb items={[{ label: t('deals.couponTitle') }]} />

      <div className="max-w-5xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.code} className="relative bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden hover:shadow-lift transition-shadow">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-brand-600 flex items-center justify-center">
              <Icon name="tag" size={26} className="text-white/90" />
            </div>
            <div className="pl-24 pr-6 py-6">
              <p className="text-3xl font-bold text-midnight-900 mb-1">-{c.discount}%</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-slate-100 font-mono text-sm font-bold tracking-widest text-midnight-900 rounded-lg">{c.code}</span>
                <button onClick={() => copy(c.code)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors flex items-center gap-1">
                  <Icon name="copy" size={12} />
                  {copied === c.code ? t('couponCodes.copied') : t('couponCodes.copy')}
                </button>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex justify-between"><span>{t('couponCodes.minOrder')}</span><span className="font-medium text-midnight-900">${c.minOrder}</span></p>
                <p className="flex justify-between"><span>{t('couponCodes.expires')}</span><span className="font-medium text-midnight-900">{formatDate(c.expires)}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
