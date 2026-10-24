import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Button, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { SOCIAL_NETWORKS, getWhatsAppUrl } from '../../utils/social.js'

export default function Social() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { settings } = siteData
  const socialEnabled = settings.socialEnabled || {}

  const set = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))
  const setEnabled = (id, v) =>
    updateSite((prev) => ({
      ...prev,
      settings: { ...prev.settings, socialEnabled: { ...(prev.settings.socialEnabled || {}), [id]: v } }
    }))

  const enabledCount = SOCIAL_NETWORKS.filter((n) => socialEnabled[n.id] !== false).length
  const waPreview = getWhatsAppUrl(settings)

  return (
    <div>
      <SectionTitle title={t('admin.social.title')} subtitle={t('admin.social.subtitle')} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.social.contact')} subtitle={t('admin.social.contactSub')}>
          <div className="space-y-4">
            <Field label={t('admin.social.whatsapp')} hint={t('admin.social.whatsappHint')}>
              <TextInput dir="ltr" value={settings.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+966501234567" />
            </Field>
            <Field label={t('admin.social.whatsappMessage')} hint={t('admin.social.whatsappMessageHint')}>
              <TextInput value={settings.whatsappMessage || ''} onChange={(e) => set('whatsappMessage', e.target.value)} />
            </Field>
            {waPreview && (
              <a href={waPreview} target="_blank" rel="noreferrer" dir="ltr" className="block truncate text-xs text-brand-600 hover:underline">
                {waPreview}
              </a>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.social.phone')}>
                <TextInput dir="ltr" value={settings.phone || ''} onChange={(e) => set('phone', e.target.value)} />
              </Field>
              <Field label={t('admin.social.email')}>
                <TextInput dir="ltr" type="email" value={settings.email || ''} onChange={(e) => set('email', e.target.value)} />
              </Field>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${settings.whatsappFloat !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Icon name="whatsapp" size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight-900">{t('admin.social.floatButton')}</p>
                  <p className="text-xs text-slate-400">{t('admin.social.floatButtonHint')}</p>
                </div>
              </div>
              <Toggle checked={settings.whatsappFloat !== false} onChange={(v) => set('whatsappFloat', v)} />
            </div>
          </div>
        </Card>

        <Card
          title={t('admin.social.networks')}
          subtitle={t('admin.social.networksSub')}
          actions={<Badge tone="blue">{enabledCount} / {SOCIAL_NETWORKS.length}</Badge>}
        >
          <div className="space-y-2.5">
            {SOCIAL_NETWORKS.map((n) => {
              const enabled = socialEnabled[n.id] !== false
              return (
                <div key={n.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${enabled ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${enabled ? 'bg-midnight-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon name={n.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-midnight-900">{n.label}</span>
                      <Toggle checked={enabled} onChange={(v) => setEnabled(n.id, v)} />
                    </div>
                    <TextInput
                      dir="ltr"
                      value={settings[n.setting] || ''}
                      onChange={(e) => set(n.setting, e.target.value)}
                      placeholder={n.id === 'whatsapp' ? '+966501234567' : `https://${n.id}.com/...`}
                      className="!py-1.5 text-xs"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => toast(t('admin.common.saved'))}>{t('admin.common.save')}</Button>
      </div>
    </div>
  )
}
