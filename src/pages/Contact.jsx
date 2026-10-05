import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, FeatureBar } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function Contact() {
  const { t } = useTranslation()
  const { toast } = useStore()
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' })
  const [sent, setSent] = useState(false)

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all'
  const label = 'block text-xs font-semibold text-slate-500 mb-1.5'

  const channels = [
    { icon: 'headset', title: t('contact.supportTitle'), text: t('contact.supportText'), action: t('contact.phone'), value: '+1 (800) 555-0199', to: '/help' },
    { icon: 'store', title: t('contact.salesTitle'), text: t('contact.salesText'), action: t('contact.email'), value: 'sell@ciarvip.com', to: '/sell' },
    { icon: 'document', title: t('contact.pressTitle'), text: t('contact.pressText'), action: t('contact.email'), value: 'press@ciarvip.com', to: '/about' }
  ]

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    toast(t('contact.sent'))
  }

  return (
    <div>
      <PageHero title={t('contact.title')} subtitle={t('contact.subtitle')} crumb={t('footer.contactUs')}  theme="contact" />
      <Breadcrumb items={[{ label: t('footer.contactUs') }]} />

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">
        {/* Channels */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-1 gap-4">
            {channels.map((c, i) => (
              <div key={c.title} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon name={c.icon} size={22} />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-midnight-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{c.text}</p>
                  <p className="text-sm"><span className="text-xs text-slate-400">{c.action}: </span><b className="text-brand-600">{c.value}</b></p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Icon name="mapPin" size={14} /> {t('contact.address')}
                </p>
                <p className="text-sm text-midnight-900 leading-relaxed">{t('contact.addressValue')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Icon name="clock" size={14} /> {t('contact.hours')}
                </p>
                <p className="text-sm text-midnight-900">{t('contact.hoursValue')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('contact.mapsNote')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
          <h2 className="font-display text-2xl font-semibold text-midnight-900 mb-6">{t('contact.formTitle')}</h2>
          {sent ? (
            <div className="text-center py-10">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5">
                <Icon name="check" size={36} />
              </span>
              <h3 className="font-bold text-midnight-900 mb-2">{t('contact.sent')}</h3>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={label}>{t('contact.name')}</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></div>
                <div><label className={label}>{t('contact.email')}</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} /></div>
              </div>
              <div>
                <label className={label}>{t('contact.topic')}</label>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={input}>
                  <option value="general">{t('contact.topicGeneral')}</option>
                  <option value="order">{t('contact.topicOrder')}</option>
                  <option value="seller">{t('contact.topicSeller')}</option>
                  <option value="returns">{t('contact.topicReturns')}</option>
                  <option value="partnership">{t('contact.topicPartnership')}</option>
                </select>
              </div>
              <div>
                <label className={label}>{t('contact.message')}</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} resize-none`} />
              </div>
              <button type="submit" className="w-full py-4 rounded-full bg-brand-600 text-white font-semibold transition-all">
                {t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
      <FeatureBar />
    </div>
  )
}
