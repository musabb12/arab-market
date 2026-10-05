import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Button } from '../ui.jsx'

const SWATCHES = [
  { name: 'Ciar Flame', brand: '#e04418', accent: '#0f2137' },
  { name: 'Coral Navy', brand: '#f25c2a', accent: '#1c3045' },
  { name: 'Ember', brand: '#bc3412', accent: '#0a1628' },
  { name: 'Emerald', brand: '#059669', accent: '#0f2137' },
  { name: 'Ocean', brand: '#0d9488', accent: '#0f2137' },
  { name: 'Amber', brand: '#ea580c', accent: '#1c3045' }
]

export default function Appearance() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { settings, content } = siteData

  const [draft, setDraft] = useState(settings)

  const apply = () => {
    updateSite((prev) => ({ ...prev, settings: { ...prev.settings, ...draft } }))
    toast(t('admin.common.saved'))
  }

  return (
    <div>
      <SectionTitle title={t('admin.appearance.title')} subtitle={t('admin.appearance.subtitle')} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.appearance.siteName')} subtitle={t('admin.appearance.tagline')}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.appearance.siteName')}><TextInput value={draft.siteName} onChange={(e) => setDraft({ ...draft, siteName: e.target.value })} /></Field>
              <Field label={t('admin.appearance.siteSuffix')}><TextInput value={draft.siteSuffix} onChange={(e) => setDraft({ ...draft, siteSuffix: e.target.value })} /></Field>
            </div>
            <Field label={t('admin.appearance.tagline')}><TextInput value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></Field>
            <Field label={t('admin.appearance.logoText')}><TextInput value={draft.logoText} maxLength={2} onChange={(e) => setDraft({ ...draft, logoText: e.target.value })} /></Field>
          </div>
        </Card>

        <Card title={t('admin.appearance.brandColor')} subtitle={t('admin.appearance.accentColor')}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.appearance.brandColor')}>
                <div className="flex items-center gap-3">
                  <input type="color" value={draft.brandColor} onChange={(e) => setDraft({ ...draft, brandColor: e.target.value })} className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer" />
                  <TextInput value={draft.brandColor} onChange={(e) => setDraft({ ...draft, brandColor: e.target.value })} />
                </div>
              </Field>
              <Field label={t('admin.appearance.accentColor')}>
                <div className="flex items-center gap-3">
                  <input type="color" value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer" />
                  <TextInput value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} />
                </div>
              </Field>
            </div>
            <div>
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
              <div className="flex-1 rounded-xl px-4 py-3 text-white text-sm font-semibold" style={{ background: draft.brandColor }}>{t('admin.appearance.brandColor')}</div>
              <div className="flex-1 rounded-xl px-4 py-3 text-white text-sm font-semibold" style={{ background: draft.accentColor }}>{t('admin.appearance.accentColor')}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title={t('admin.appearance.preview')} subtitle={t('admin.appearance.subtitle')}>
          <div className="rounded-2xl overflow-hidden border border-slate-100">
            <div className="px-5 py-2.5 text-xs text-white font-medium" style={{ background: draft.brandColor }}>
              {content.announcement}
            </div>
            <div className="px-5 py-5 flex items-center bg-white">
              <span className="font-display text-3xl font-bold tracking-tight text-midnight-900 leading-none">
                {draft.siteName} <span style={{ color: draft.brandColor }}>{draft.siteSuffix}</span>
              </span>
            </div>
            <div className="px-5 py-6 bg-slate-50 flex items-center justify-center">
              <span className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg" style={{ background: draft.brandColor }}>
                {t('admin.common.manage')}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end"><Button size="lg" onClick={apply}>{t('admin.common.save')}</Button></div>
    </div>
  )
}
