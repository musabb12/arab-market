import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { AccountNav } from './Account.jsx'
import { LANGUAGES } from '../utils/helpers.js'
import { CURRENCIES } from '../i18n/index.js'
import Icon from '../components/Icons.jsx'

export default function Settings() {
  const { t } = useTranslation()
  const { user, setLanguage, language, setCurrency, currency, toast } = useStore()
  const [profile, setProfile] = useState({ name: user?.name || 'Alex Morgan', email: user?.email || 'alex@example.com', phone: '+971 50 123 4567' })
  const [prefs, setPrefs] = useState({ notifications: true, newsletter: true, marketing: false })
  const [pass, setPass] = useState({ current: '', next: '', confirm: '' })

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors'
  const label = 'block text-xs font-semibold text-slate-500 mb-1.5'

  const saveProfile = (e) => {
    e.preventDefault()
    toast(t('account.saved'))
  }

  return (
    <div>
      <PageHero title={t('account.settings')} crumb={t('nav.account')} />
      <Breadcrumb items={[{ label: t('account.settings') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <AccountNav active="settings" />
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile */}
          <form onSubmit={saveProfile} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
            <h3 className="font-bold text-midnight-900 mb-5 flex items-center gap-2">
              <Icon name="user" size={18} className="text-brand-600" />
              {t('account.profile')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={label}>{t('auth.name')}</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={input} /></div>
              <div><label className={label}>{t('auth.email')}</label><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={input} /></div>
              <div><label className={label}>{t('checkout.phone')}</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={input} /></div>
            </div>
            <button type="submit" className="mt-5 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">{t('account.saveChanges')}</button>
          </form>

          {/* Preferences */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
            <h3 className="font-bold text-midnight-900 mb-5 flex items-center gap-2">
              <Icon name="settings" size={18} className="text-brand-600" />
              {t('account.preferences')}
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-midnight-900 mb-3">{t('account.languagePref')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${language === l.code ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-midnight-900 mb-3">{t('account.currencyPref')}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CURRENCIES).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2 ${currency === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
                    >
                      {c} <span className="text-xs opacity-60">{CURRENCIES[c].symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
            <h3 className="font-bold text-midnight-900 mb-5 flex items-center gap-2">
              <Icon name="bell" size={18} className="text-brand-600" />
              {t('account.notifications')}
            </h3>
            <div className="space-y-3">
              {[
                { key: 'notifications', label: 'Order updates and delivery notifications' },
                { key: 'newsletter', label: t('footer.newsletter') },
                { key: 'marketing', label: 'Personalized offers and product recommendations' }
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 cursor-pointer">
                  <span className="text-sm text-midnight-900">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`relative h-7 w-12 rounded-full transition-colors ${prefs[item.key] ? 'bg-brand-600' : 'bg-slate-200'}`}
                    aria-label={item.label}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${prefs[item.key] ? 'left-6' : 'left-1'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <form onSubmit={(e) => { e.preventDefault(); toast(t('account.saved')) }} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
            <h3 className="font-bold text-midnight-900 mb-5 flex items-center gap-2">
              <Icon name="lock" size={18} className="text-brand-600" />
              {t('auth.password')}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className={label}>{t('auth.password')}</label><input type="password" value={pass.current} onChange={(e) => setPass({ ...pass, current: e.target.value })} className={input} /></div>
              <div><label className={label}>{t('auth.confirmPassword')}</label><input type="password" value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} className={input} /></div>
              <div><label className={label}>Confirm new</label><input type="password" value={pass.confirm} onChange={(e) => setPass({ ...pass, confirm: e.target.value })} className={input} /></div>
            </div>
            <button type="submit" className="mt-5 px-6 py-3 rounded-full bg-midnight-900 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  )
}
