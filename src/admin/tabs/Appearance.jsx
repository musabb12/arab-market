import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Button } from '../ui.jsx'

const SWATCHES = [
  { name: 'ARAB Blue', brand: '#3f6eee', accent: '#a855f7' },
  { name: 'Emerald', brand: '#059669', accent: '#0ea5e9' },
  { name: 'Royal Purple', brand: '#7c3aed', accent: '#ec4899' },
  { name: 'Crimson', brand: '#e11d48', accent: '#f59e0b' },
  { name: 'Ocean Teal', brand: '#0d9488', accent: '#6366f1' },
  { name: 'Sunset', brand: '#ea580c', accent: '#db2777' }
]

export default function Appearance() {
  const { siteData, updateSite, toast } = useStore()
  const { settings, content } = siteData

  const [draft, setDraft] = useState(settings)

  const apply = () => {
    updateSite((prev) => ({ ...prev, settings: { ...prev.settings, ...draft } }))
    toast('Theme applied')
  }

  return (
    <div>
      <SectionTitle title="Appearance" subtitle="Brand identity and theme colors" />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Brand identity" subtitle="Site name and logo">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Site name"><TextInput value={draft.siteName} onChange={(e) => setDraft({ ...draft, siteName: e.target.value })} /></Field>
              <Field label="Site suffix"><TextInput value={draft.siteSuffix} onChange={(e) => setDraft({ ...draft, siteSuffix: e.target.value })} /></Field>
            </div>
            <Field label="Tagline"><TextInput value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></Field>
            <Field label="Logo letter"><TextInput value={draft.logoText} maxLength={2} onChange={(e) => setDraft({ ...draft, logoText: e.target.value })} /></Field>
          </div>
        </Card>

        <Card title="Color palette" subtitle="Brand and accent colors used across the store">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Brand color">
                <div className="flex items-center gap-3">
                  <input type="color" value={draft.brandColor} onChange={(e) => setDraft({ ...draft, brandColor: e.target.value })} className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer" />
                  <TextInput value={draft.brandColor} onChange={(e) => setDraft({ ...draft, brandColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Accent color">
                <div className="flex items-center gap-3">
                  <input type="color" value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer" />
                  <TextInput value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} />
                </div>
              </Field>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Quick presets</p>
              <div className="flex flex-wrap gap-2">
                {SWATCHES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setDraft({ ...draft, brandColor: s.brand, accentColor: s.accent })}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-brand-400 transition-colors"
                  >
                    <span className="h-5 w-5 rounded-full" style={{ background: s.brand }} />
                    <span className="text-xs font-semibold text-slate-600">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <div className="flex-1 rounded-xl px-4 py-3 text-white text-sm font-semibold" style={{ background: draft.brandColor }}>Brand</div>
              <div className="flex-1 rounded-xl px-4 py-3 text-white text-sm font-semibold" style={{ background: draft.accentColor }}>Accent</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Storefront preview" subtitle="Live preview of your brand">
          <div className="rounded-2xl overflow-hidden border border-slate-100">
            <div className="px-5 py-2.5 text-xs text-white font-medium" style={{ background: draft.brandColor }}>
              {content.announcement}
            </div>
            <div className="px-5 py-4 flex items-center gap-3 bg-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold" style={{ background: `linear-gradient(135deg, ${draft.brandColor}, ${draft.accentColor})` }}>
                {draft.logoText}
              </span>
              <span className="font-display font-bold text-midnight-900">{draft.siteName}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: draft.brandColor }}>{draft.siteSuffix}</span>
            </div>
            <div className="px-5 py-6 bg-slate-50 flex items-center justify-center">
              <span className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg" style={{ background: `linear-gradient(90deg, ${draft.brandColor}, ${draft.accentColor})` }}>
                Shop now
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end"><Button size="lg" onClick={apply}>Apply theme</Button></div>
    </div>
  )
}
