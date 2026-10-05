import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Payments() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { payments } = siteData

  const toggle = (id, enabled) => {
    updateSite((prev) => ({ ...prev, payments: prev.payments.map((p) => (p.id === id ? { ...p, enabled } : p)) }))
    toast(enabled ? t('admin.common.enabled') : t('admin.common.disabled'))
  }

  const icons = { card: 'creditCard', cod: 'wallet', paypal: 'wallet', applepay: 'apple', googlepay: 'wallet' }

  return (
    <div>
      <SectionTitle title={t('admin.payments.title')} subtitle={t('admin.payments.subtitle')} />

      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p) => (
            <div key={p.id} className="border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.enabled ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Icon name={icons[p.id] || 'creditCard'} size={22} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-midnight-900">{p.name}</p>
              </div>
              <Toggle checked={p.enabled} onChange={(v) => toggle(p.id, v)} />
            </div>
          ))}
        </div>
        <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="blue"><Icon name="info" size={11} /></Badge>
            <span className="font-semibold text-midnight-900">{t('admin.payments.live')}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
