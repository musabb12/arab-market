import React from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge, Button } from '../ui.jsx'

export default function Languages() {
  const { siteData, updateSite, toast } = useStore()
  const { languages, settings } = siteData

  const toggle = (code, enabled) => {
    updateSite((prev) => ({
      ...prev,
      languages: prev.languages.map((l) => (l.code === code ? { ...l, enabled } : l))
    }))
    toast(`${code.toUpperCase()} ${enabled ? 'enabled' : 'disabled'}`)
  }

  const setDefault = (code) => {
    updateSite((prev) => ({ ...prev, settings: { ...prev.settings, defaultLanguage: code } }))
    toast(`Default language set to ${code.toUpperCase()}`)
  }

  return (
    <div>
      <SectionTitle title="Languages" subtitle="Choose which languages are available to storefront shoppers" />

      <Card>
        <div className="grid sm:grid-cols-2 gap-3">
          {languages.map((l) => (
            <div key={l.code} className="border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              <span className="flex h-9 w-11 items-center justify-center rounded-lg bg-midnight-900 text-white text-[11px] font-bold">{l.code.toUpperCase()}</span>
              <div className="flex-1">
                <p className="font-semibold text-midnight-900 text-sm">{l.name}</p>
                <p className="text-xs text-slate-400">{l.dir === 'rtl' ? 'Right-to-left' : 'Left-to-right'}</p>
              </div>
              {settings.defaultLanguage === l.code && <Badge tone="blue">Default</Badge>}
              <button
                onClick={() => setDefault(l.code)}
                className={`text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors ${settings.defaultLanguage === l.code ? 'text-slate-300' : 'text-brand-600 hover:bg-brand-50'}`}
              >
                Default
              </button>
              <Toggle checked={l.enabled} onChange={(v) => toggle(l.code, v)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
