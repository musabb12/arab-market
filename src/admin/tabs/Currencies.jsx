import React from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge, Button, Field, TextInput } from '../ui.jsx'

export default function Currencies() {
  const { siteData, updateSite, toast } = useStore()
  const { currencies, settings } = siteData

  const toggle = (code, enabled) => {
    updateSite((prev) => ({ ...prev, currencies: prev.currencies.map((c) => (c.code === code ? { ...c, enabled } : c)) }))
    toast(`${code} ${enabled ? 'enabled' : 'disabled'}`)
  }

  const setRate = (code, rate) => {
    updateSite((prev) => ({ ...prev, currencies: prev.currencies.map((c) => (c.code === code ? { ...c, rate: Number(rate) || 0 } : c)) }))
  }

  const setDefault = (code) => {
    updateSite((prev) => ({ ...prev, settings: { ...prev.settings, defaultCurrency: code } }))
    toast(`Default currency set to ${code}`)
  }

  return (
    <div>
      <SectionTitle title="Currencies" subtitle="Configure the currencies shoppers can view prices in" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Currency</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Symbol</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Exchange rate (1 USD)</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Default</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currencies.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-midnight-900">{c.code}</td>
                  <td className="px-4 py-3 text-slate-600">{c.symbol}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={c.rate}
                      onChange={(e) => setRate(c.code, e.target.value)}
                      className="w-28 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    {settings.defaultCurrency === c.code ? (
                      <Badge tone="blue">Default</Badge>
                    ) : (
                      <button onClick={() => setDefault(c.code)} className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2 py-1.5 rounded-lg">Set default</button>
                    )}
                  </td>
                  <td className="px-4 py-3"><Toggle checked={c.enabled} onChange={(v) => toggle(c.code, v)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
