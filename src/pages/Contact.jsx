import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, FeatureBar } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import { getSocialLinks, getWhatsAppUrl } from '../utils/social.js'

export default function Contact() {
  const { t } = useTranslation()
  const { toast, settings } = useStore()
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' })
  const [sent, setSent] = useState(false)

  const phone = settings?.phone || '+966 11 234 5678'
  const whatsappDisplay = settings?.whatsapp || '+966 50 123 4567'
  const whatsappUrl = getWhatsAppUrl(settings)
  const mail = settings?.email || 'hello@ciarvip.com'

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all'
  const label = 'block text-xs font-semibold text-slate-500 mb-1.5'

  const channels = [
    { icon: 'phone', title: t('contact.phone'), text: t('contact.supportText'), action: t('contact.phone'), value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: 'whatsapp', title: 'WhatsApp', text: t('contact.whatsappText'), action: 'WhatsApp', value: whatsappDisplay, href: whatsappUrl },
    { icon: 'mail', title: t('contact.email'), text: t('contact.salesText'), action: t('contact.email'), value: mail, href: `mailto:${mail}` }
  ]

  const social = getSocialLinks(settings)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    toast(t('contact.sent'))
  }

  return (
    <div>
      <PageHero title={t('contact.title')} subtitle={t('contact.subtitle')} crumb={t('footer.contactUs')} theme="contact" />
      <Breadcrumb items={[{ label: t('footer.contactUs') }]} />

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-1 gap-4">
            {channels.map((c) => (
              <a key={c.title} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="bg-white dark:bg-midnight-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-6 flex items-start gap-4 hover:border-brand-400/40 transition-colors">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon name={c.icon} size={22} />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-midnight-900 dark:text-white mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{c.text}</p>
                  <p className="text-sm"><span className="text-xs text-slate-400">{c.action}: </span><b className="text-brand-600" dir="ltr">{c.value}</b></p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t('contact.socialTitle')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-midnight-800 text-sm font-semibold text-midnight-900 dark:text-white hover:bg-brand-50 dark:hover:bg-midnight-700 transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-midnight-950 border border-slate-100 dark:border-white/10 text-midnight-900 dark:text-white">
                    <Icon name={s.icon} size={15} />
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Icon name="mapPin" size={14} /> {t('contact.address')}
                </p>
                <p className="text-sm text-midnight-900 dark:text-white leading-relaxed">{t('contact.addressValue')}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Icon name="clock" size={14} /> {t('contact.hours')}
                </p>
                <p className="text-sm text-midnight-900 dark:text-white">{t('contact.hoursValue')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('contact.mapsNote')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-midnight-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-soft p-7">
          <h2 className="font-display text-2xl font-semibold text-midnight-900 dark:text-white mb-6">{t('contact.formTitle')}</h2>
          {sent ? (
            <div className="text-center py-10">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5">
                <Icon name="check" size={36} />
              </span>
              <h3 className="font-bold text-midnight-900 dark:text-white mb-2">{t('contact.sent')}</h3>
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
