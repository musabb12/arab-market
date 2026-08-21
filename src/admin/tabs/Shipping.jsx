import React from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Toggle, Button } from '../ui.jsx'

export default function Shipping() {
  const { siteData, updateSite, toast } = useStore()
  const { settings, shippingMethods } = siteData

  const setSetting = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))

  const setMethod = (id, patch) => updateSite((prev) => ({ ...prev, shippingMethods: prev.shippingMethods.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))

  const save = () => toast('Shipping and tax settings saved')

  return (
    <div>
      <SectionTitle title="Shipping & Tax" subtitle="Control delivery fees, free shipping threshold and tax rate" />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Shipping rules" subtitle="Applied across checkout">
          <div className="space-y-4">
            <Field label="Free shipping threshold (USD)" hint="Orders at or above this amount ship free">
              <TextInput type="number" value={settings.freeShippingThreshold} onChange={(e) => setSetting('freeShippingThreshold', Number(e.target.value))} />
            </Field>
            <Field label="Standard shipping fee (USD)" hint="Charged when the threshold is not met">
              <TextInput type="number" step="0.01" value={settings.shippingFee} onChange={(e) => setSetting('shippingFee', Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <Card title="Taxation" subtitle="Sales tax applied to order subtotals">
          <Field label="Tax rate (%)" hint="Applied to every order">
            <TextInput type="number" step="0.1" value={settings.taxRate} onChange={(e) => setSetting('taxRate', Number(e.target.value))} />
          </Field>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Delivery methods" subtitle="Methods customers can pick at checkout">
          <div className="space-y-4">
            {shippingMethods.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-4 border border-slate-100 rounded-xl p-4">
                <div className="flex-1 min-w-[220px]">
                  <Field label="Name"><TextInput value={m.name} onChange={(e) => setMethod(m.id, { name: e.target.value })} /></Field>
                </div>
                <div className="w-36">
                  <Field label="Fee (USD)"><TextInput type="number" step="0.01" value={m.fee} onChange={(e) => setMethod(m.id, { fee: Number(e.target.value) })} /></Field>
                </div>
                <div className="w-36">
                  <Field label="ETA"><TextInput value={m.eta} onChange={(e) => setMethod(m.id, { eta: e.target.value })} /></Field>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle checked={m.enabled !== false} onChange={(v) => setMethod(m.id, { enabled: v })} />
                  <span className="text-sm font-medium text-slate-600">Enabled</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end"><Button onClick={save}>Save shipping settings</Button></div>
        </Card>
      </div>
    </div>
  )
}
