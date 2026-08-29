import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { COUNTRIES } from '../utils/helpers.js'
import { AccountNav } from './Account.jsx'
import Icon from '../components/Icons.jsx'

export default function Addresses() {
  const { t } = useTranslation()
  const { toast } = useStore()
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      firstName: 'Alex',
      lastName: 'Morgan',
      line: '100 Market Street, Suite 500',
      city: 'Dubai',
      country: 'United Arab Emirates',
      zip: '00000',
      phone: '+971 50 123 4567',
      default: true
    }
  ])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({})

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors'
  const label = 'block text-xs font-semibold text-slate-500 mb-1.5'

  const startEdit = (addr) => {
    setEditing(addr.id)
    setForm(addr)
    setShowForm(true)
  }

  const save = (e) => {
    e.preventDefault()
    if (editing) {
      setAddresses((prev) => prev.map((a) => (a.id === editing ? { ...a, ...form } : a)))
    } else {
      setAddresses((prev) => [...prev, { ...form, id: Date.now() }])
    }
    setShowForm(false)
    setEditing(null)
    setForm({})
    toast(t('account.saved'))
  }

  return (
    <div>
      <PageHero title={t('account.addresses')} crumb={t('nav.account')}  theme="account" />
      <Breadcrumb items={[{ label: t('account.addresses') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <AccountNav active="addresses" />
        <div className="flex-1 min-w-0">
          {showForm ? (
            <form onSubmit={save} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7 space-y-4">
              <h3 className="font-bold text-midnight-900 mb-2">{editing ? t('account.editProfile') : t('account.addresses')}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={label}>{t('checkout.firstName')}</label><input required value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={input} /></div>
                <div><label className={label}>{t('checkout.lastName')}</label><input required value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={input} /></div>
                <div className="sm:col-span-2"><label className={label}>{t('checkout.address')}</label><input required value={form.line || ''} onChange={(e) => setForm({ ...form, line: e.target.value })} className={input} /></div>
                <div><label className={label}>{t('checkout.city')}</label><input required value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} /></div>
                <div><label className={label}>{t('checkout.zip')}</label><input required value={form.zip || ''} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={input} /></div>
                <div><label className={label}>{t('checkout.country')}</label>
                  <select value={form.country || COUNTRIES[0]} onChange={(e) => setForm({ ...form, country: e.target.value })} className={input}>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className={label}>{t('checkout.phone')}</label><input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">{t('account.saveChanges')}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-600">{t('common.reset')}</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => { setEditing(null); setForm({}); setShowForm(true) }} className="px-5 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold flex items-center gap-2">
                  <Icon name="plus" size={16} />
                  {t('account.addresses')}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{a.label}</span>
                      {a.default && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="text-sm font-semibold text-midnight-900">{a.firstName} {a.lastName}</p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{a.line}<br />{a.city}, {a.country} {a.zip}</p>
                    <p className="text-sm text-slate-500 mt-1">{a.phone}</p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => startEdit(a)} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                        <Icon name="edit" size={13} /> {t('account.editProfile')}
                      </button>
                      <button className="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1">
                        <Icon name="trash" size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
