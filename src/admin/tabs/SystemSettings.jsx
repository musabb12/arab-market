import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Toggle, Button, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function SystemSettings() {
  const { t } = useTranslation()
  const { siteData, updateSite, resetSiteData, toast } = useStore()
  const { settings } = siteData

  const set = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))

  const [confirmReset, setConfirmReset] = useState(false)

  const reset = () => {
    resetSiteData()
    toast(t('admin.common.saved'))
    setConfirmReset(false)
  }

  return (
    <div>
      <SectionTitle title={t('admin.system.title')} subtitle={t('admin.system.subtitle')} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.system.maintenance')} subtitle={t('admin.system.maintenanceHint')}>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${settings.maintenanceMode ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Icon name={settings.maintenanceMode ? 'lock' : 'check'} size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">{t('admin.system.maintenance')}</p>
                  <p className="text-xs text-slate-400">{t('admin.system.maintenanceHint')}</p>
                </div>
              </div>
              <Toggle checked={settings.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="compare" size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">{t('admin.system.allowCompare')}</p>
                </div>
              </div>
              <Toggle checked={settings.allowCompare !== false} onChange={(v) => { set('allowCompare', v) }} />
            </div>
          </div>
        </Card>

        <Card title={t('admin.system.lowStock')} subtitle={t('admin.system.maxCompare')}>
          <div className="space-y-4">
            <Field label={t('admin.system.lowStock')}>
              <TextInput type="number" value={settings.lowStockThreshold} onChange={(e) => set('lowStockThreshold', Number(e.target.value))} />
            </Field>
            <Field label={t('admin.system.maxCompare')}>
              <TextInput type="number" min="2" max="6" value={settings.maxCompare} onChange={(e) => set('maxCompare', Number(e.target.value))} />
            </Field>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-midnight-900">{t('admin.common.status')}</p>
              </div>
              <Badge tone="green">{t('admin.common.active')}</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title={t('admin.system.resetData')} subtitle={t('admin.system.resetHint')}>
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50">
            <div>
              <p className="text-sm font-semibold text-red-600">{t('admin.system.resetData')}</p>
              <p className="text-xs text-slate-500">{t('admin.system.resetHint')}</p>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setConfirmReset(false)}>{t('admin.common.cancel')}</Button>
                <Button variant="danger" onClick={reset}><Icon name="trash" size={15} /> {t('admin.common.reset')}</Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmReset(true)}><Icon name="trash" size={15} /> {t('admin.system.resetData')}</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
