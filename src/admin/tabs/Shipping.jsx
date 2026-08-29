import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Toggle, Button } from '../ui.jsx'

export default function Shipping() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { settings, shippingMethods } = siteData

  const setSetting = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))

  const setMethod = (id, patch) => updateSite((prev) => ({ ...prev, shippingMethods: prev.shippingMethods.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))

  const save = () => toast(t('admin.common.saved'))

  return (
    <div>
      <SectionTitle title={t('admin.shipping.title')} subtitle={t('admin.shipping.subtitle')} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.shipping.rules')} subtitle={t('admin.shipping.rulesSub')}>
          <div className="space-y-4">
            <Field label={t('admin.shipping.freeThreshold')}>
              <TextInput type="number" value={settings.freeShippingThreshold} onChange={(e) => setSetting('freeShippingThreshold', Number(e.target.value))} />
            </Field>
            <Field label={t('admin.shipping.standardFee')}>
              <TextInput type="number" step="0.01" value={settings.shippingFee} onChange={(e) => setSetting('shippingFee', Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <Card title={t('admin.shipping.taxation')} subtitle={t('admin.shipping.taxationSub')}>
          <Field label={t('admin.shipping.taxRate')}>
            <TextInput type="number" step="0.1" value={settings.taxRate} onChange={(e) => setSetting('taxRate', Number(e.target.value))} />
          </Field>
        </Card>
      </div>

      <div className="mt-6">
        <Card title={t('admin.shipping.methods')} subtitle={t('admin.shipping.methodsSub')}>
          <div className="space-y-4">
            {shippingMethods.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-4 border border-slate-100 rounded-xl p-4">
                <div className="flex-1 min-w-[220px]">
                  <Field label={t('admin.common.name')}><TextInput value={m.name} onChange={(e) => setMethod(m.id, { name: e.target.value })} /></Field>
                </div>
                <div className="w-36">
                  <Field label={t('admin.common.price')}><TextInput type="number" step="0.01" value={m.fee} onChange={(e) => setMethod(m.id, { fee: Number(e.target.value) })} /></Field>
                </div>
                <div className="w-36">
                  <Field label={t('admin.common.date')}><TextInput value={m.eta} onChange={(e) => setMethod(m.id, { eta: e.target.value })} /></Field>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle checked={m.enabled !== false} onChange={(v) => setMethod(m.id, { enabled: v })} />
                  <span className="text-sm font-medium text-slate-600">{t('admin.common.enabled')}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end"><Button onClick={save}>{t('admin.shipping.save')}</Button></div>
        </Card>
      </div>
    </div>
  )
}
