import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Toggle, Button, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function SystemSettings() {
  const { siteData, updateSite, resetSiteData, toast } = useStore()
  const { settings } = siteData

  const set = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))

  const [confirmReset, setConfirmReset] = useState(false)

  const reset = () => {
    resetSiteData()
    toast('Site data reset to defaults')
    setConfirmReset(false)
  }

  return (
    <div>
      <SectionTitle title="System Settings" subtitle="Global store configuration and maintenance controls" />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Maintenance" subtitle="Control storefront availability">
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${settings.maintenanceMode ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Icon name={settings.maintenanceMode ? 'lock' : 'check'} size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">Maintenance mode</p>
                  <p className="text-xs text-slate-400">Shows a maintenance screen to visitors</p>
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
                  <p className="text-sm font-semibold text-midnight-900">Product comparison</p>
                  <p className="text-xs text-slate-400">Allow shoppers to compare products</p>
                </div>
              </div>
              <Toggle checked={settings.allowCompare !== false} onChange={(v) => { set('allowCompare', v) }} />
            </div>
          </div>
        </Card>

        <Card title="Operational thresholds" subtitle="Inventory and storefront limits">
          <div className="space-y-4">
            <Field label="Low stock threshold" hint="Products below this stock level trigger alerts">
              <TextInput type="number" value={settings.lowStockThreshold} onChange={(e) => set('lowStockThreshold', Number(e.target.value))} />
            </Field>
            <Field label="Max compare items" hint="Maximum products a shopper can compare">
              <TextInput type="number" min="2" max="6" value={settings.maxCompare} onChange={(e) => set('maxCompare', Number(e.target.value))} />
            </Field>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-midnight-900">Data status</p>
                <p className="text-xs text-slate-400">All changes persist in this browser</p>
              </div>
              <Badge tone="green">Live</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Danger zone" subtitle="Restore the store to its factory defaults">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-red-100 bg-red-50/50">
            <div>
              <p className="text-sm font-semibold text-red-600">Reset all site data</p>
              <p className="text-xs text-slate-500">Clears all admin changes made in this session and restores seed data. This cannot be undone.</p>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancel</Button>
                <Button variant="danger" onClick={reset}><Icon name="trash" size={15} /> Confirm reset</Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmReset(true)}><Icon name="trash" size={15} /> Reset site data</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
