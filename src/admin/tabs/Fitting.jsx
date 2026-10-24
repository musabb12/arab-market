import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Button, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { defaultSiteData } from '../../data/siteDefaults.js'

const SECTION_TOGGLES = [
  { key: 'showPhoto', icon: 'upload' },
  { key: 'showMeasurements', icon: 'user' },
  { key: 'showPreferences', icon: 'heart' }
]

const WEIGHT_KEYS = ['category', 'segment', 'color', 'size', 'budget', 'rating', 'fit']

export default function Fitting() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast, products } = useStore()
  const cfg = siteData.fitting || {}
  const weights = { ...defaultSiteData.fitting.weights, ...(cfg.weights || {}) }

  const setCfg = (patch) => updateSite((prev) => ({ ...prev, fitting: { ...prev.fitting, ...patch } }))
  const setWeight = (k, v) => setCfg({ weights: { ...weights, [k]: Math.max(0, Number(v) || 0) } })

  const productsWithColors = products.filter((p) => (p.colors || []).length).length
  const productsWithSizes = products.filter((p) => (p.sizes || []).length).length

  return (
    <div>
      <SectionTitle
        title={t('admin.fitting.title')}
        subtitle={t('admin.fitting.subtitle')}
        actions={
          <Link to="/fitting-room" target="_blank" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-all">
            <Icon name="eye" size={14} /> {t('admin.fitting.preview')}
          </Link>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card
          title={t('admin.fitting.general')}
          subtitle={t('admin.fitting.generalSub')}
          actions={<Badge tone={cfg.enabled !== false ? 'green' : 'gray'}>{cfg.enabled !== false ? t('admin.common.enabled') : t('admin.common.disabled')}</Badge>}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${cfg.enabled !== false ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Icon name="sparkle" size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">{t('admin.fitting.enabled')}</p>
                  <p className="text-[11px] text-slate-400">{t('admin.fitting.enabledHint')}</p>
                </div>
              </div>
              <Toggle checked={cfg.enabled !== false} onChange={(v) => setCfg({ enabled: v })} />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-midnight-50 text-midnight-700">
                  <Icon name="link" size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">{t('admin.fitting.navLink')}</p>
                  <p className="text-[11px] text-slate-400">{t('admin.fitting.navLinkHint')}</p>
                </div>
              </div>
              <Toggle checked={cfg.navLink !== false} onChange={(v) => setCfg({ navLink: v })} />
            </div>
          </div>
        </Card>

        <Card title={t('admin.fitting.sections')} subtitle={t('admin.fitting.sectionsSub')}>
          <div className="space-y-2.5">
            {SECTION_TOGGLES.map((s) => (
              <div key={s.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-midnight-50 text-midnight-700">
                    <Icon name={s.icon} size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight-900">{t(`admin.fitting.sec_${s.key}`)}</p>
                    <p className="text-[11px] text-slate-400">{t(`admin.fitting.sec_${s.key}Hint`)}</p>
                  </div>
                </div>
                <Toggle checked={cfg[s.key] !== false} onChange={(v) => setCfg({ [s.key]: v })} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card title={t('admin.fitting.results')} subtitle={t('admin.fitting.resultsSub')}>
          <div className="space-y-5">
            <Field label={`${t('admin.fitting.resultsCount')} — ${cfg.resultsCount || 8}`}>
              <input
                type="range" min="4" max="16" step="1"
                value={cfg.resultsCount || 8}
                onChange={(e) => setCfg({ resultsCount: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </Field>
            <Field label={`${t('admin.fitting.minScore')} — ${cfg.minScore ?? 25}%`} hint={t('admin.fitting.minScoreHint')}>
              <input
                type="range" min="0" max="60" step="5"
                value={cfg.minScore ?? 25}
                onChange={(e) => setCfg({ minScore: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </Field>
            <Field label={t('admin.fitting.budgetMax')} hint={t('admin.fitting.budgetMaxHint')}>
              <TextInput
                type="number" dir="ltr"
                value={cfg.budgetMax ?? 50000}
                onChange={(e) => setCfg({ budgetMax: Number(e.target.value) || 50000 })}
              />
            </Field>
          </div>
        </Card>

        <Card
          title={t('admin.fitting.weights')}
          subtitle={t('admin.fitting.weightsSub')}
          actions={
            <Button variant="outline" size="sm" onClick={() => setCfg({ weights: { ...defaultSiteData.fitting.weights } })}>
              <Icon name="refresh" size={13} /> {t('admin.common.reset')}
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            {WEIGHT_KEYS.map((k) => (
              <Field key={k} label={t(`admin.fitting.w_${k}`)}>
                <TextInput
                  type="number" dir="ltr" min="0" max="100"
                  value={weights[k]}
                  onChange={(e) => setWeight(k, e.target.value)}
                />
              </Field>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3.5 flex items-start gap-2.5">
            <Icon name="info" size={15} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed">{t('admin.fitting.weightsHint')}</p>
          </div>
        </Card>
      </div>

      <Card title={t('admin.fitting.dataHealth')} subtitle={t('admin.fitting.dataHealthSub')} className="mt-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-midnight-900">{products.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">{t('admin.fitting.totalProducts')}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-midnight-900">{productsWithColors}</p>
            <p className="text-[11px] text-slate-400 mt-1">{t('admin.fitting.withColors')}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-4 text-center">
            <p className="text-2xl font-bold text-midnight-900">{productsWithSizes}</p>
            <p className="text-[11px] text-slate-400 mt-1">{t('admin.fitting.withSizes')}</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">{t('admin.fitting.dataHealthHint')}</p>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => toast(t('admin.common.saved'))}>{t('admin.common.save')}</Button>
      </div>
    </div>
  )
}
