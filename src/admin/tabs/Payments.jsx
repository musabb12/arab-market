import React from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Payments() {
  const { siteData, updateSite, toast } = useStore()
  const { payments } = siteData

  const toggle = (id, enabled) => {
    updateSite((prev) => ({ ...prev, payments: prev.payments.map((p) => (p.id === id ? { ...p, enabled } : p)) }))
    toast(`Payment method ${enabled ? 'enabled' : 'disabled'}`)
  }

  const icons = { card: 'creditCard', cod: 'wallet', paypal: 'wallet', applepay: 'apple', googlepay: 'wallet' }

  return (
    <div>
      <SectionTitle title="Payment Methods" subtitle="Payment options offered at checkout" />

      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          {payments.map((p) => (
            <div key={p.id} className="border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.enabled ? 'bg-gradient-to-br from-brand-500 to-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Icon name={icons[p.id] || 'creditCard'} size={22} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-midnight-900">{p.name}</p>
                <p className="text-xs text-slate-400">{p.id === 'cod' ? 'Pay in cash on delivery' : 'Online payment via provider'}</p>
              </div>
              <Toggle checked={p.enabled} onChange={(v) => toggle(p.id, v)} />
            </div>
          ))}
        </div>
        <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-2">
            <Badge tone="blue"><Icon name="info" size={11} /></Badge>
            <span className="font-semibold text-midnight-900">Live configuration</span>
          </div>
          Disabled methods are hidden from the storefront checkout. At least one method must remain enabled.
        </div>
      </Card>
    </div>
  )
}
