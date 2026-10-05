import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, FeatureBar } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { api } from '../api/client.js'
import Icon from '../components/Icons.jsx'

const input = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all'

export default function Sell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, refreshCatalog, toast } = useStore()
  const [form, setForm] = useState({ storeName: '', country: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const stats = [
    { value: '2M+', label: t('sell.statSellers') },
    { value: '1B+', label: t('sell.statProducts') },
    { value: '$50B', label: t('sell.statRevenue') },
    { value: '200+', label: t('sell.statCountries') }
  ]

  const reasons = [
    { icon: 'tag', title: t('sell.feeTitle'), text: t('sell.feeText') },
    { icon: 'truck', title: t('sell.logisticsTitle'), text: t('sell.logisticsText') },
    { icon: 'user', title: t('sell.audienceTitle'), text: t('sell.audienceText') },
    { icon: 'chart', title: t('sell.toolsTitle'), text: t('sell.toolsText') },
    { icon: 'wallet', title: t('sell.paymentTitle'), text: t('sell.paymentText') }
  ]

  const steps = [
    { n: '01', title: t('sell.step1Title'), text: t('sell.step1Text') },
    { n: '02', title: t('sell.step2Title'), text: t('sell.step2Text') },
    { n: '03', title: t('sell.step3Title'), text: t('sell.step3Text') },
    { n: '04', title: t('sell.step4Title'), text: t('sell.step4Text') }
  ]

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!user) {
      navigate('/register?next=/sell')
      return
    }
    setLoading(true)
    try {
      const res = await api.applySeller(form)
      setDone(res.seller)
      toast(res.message || 'Application submitted')
      await refreshCatalog()
    } catch (err) {
      setError(typeof err.data?.error === 'string' ? err.data.error : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHero title={t('sell.title')} subtitle={t('sell.subtitle')} crumb={t('nav.sell')}  theme="sell" />
      <Breadcrumb items={[{ label: t('nav.sell') }]} />

      <section className="relative overflow-hidden bg-midnight-900 py-20">
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-brand-100 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold text-midnight-900 mb-2">{t('sell.ctaTitle')}</h2>
            <p className="text-slate-500">{t('sell.ctaText')}</p>
          </div>

          {done ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center">
              <Icon name="check" size={36} className="mx-auto text-emerald-600 mb-3" />
              <h3 className="font-bold text-midnight-900 text-xl mb-2">{done.name}</h3>
              <p className="text-sm text-slate-600 mb-6">
                Status: <span className="font-semibold capitalize">{done.status}</span>. An admin will review your application.
              </p>
              {done.status === 'approved' ? (
                <Link to="/seller" className="inline-flex px-8 py-3 rounded-full bg-brand-600 text-white font-semibold">
                  {t('seller.dashboard')}
                </Link>
              ) : (
                <Link to="/account" className="inline-flex px-8 py-3 rounded-full border border-slate-200 font-semibold text-midnight-900">
                  {t('nav.account')}
                </Link>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-4">
              {!user && (
                <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl px-4 py-3">
                  Please <Link to="/login" className="font-semibold underline">sign in</Link> or{' '}
                  <Link to="/register" className="font-semibold underline">create an account</Link> before applying.
                </div>
              )}
              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Store name</label>
                <input required value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={input} placeholder="My Premium Store" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Country</label>
                <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={input} placeholder="Saudi Arabia" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">About your business</label>
                <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={input} placeholder="What do you sell?" />
              </div>
              <button
                type="submit"
                disabled={loading || !user}
                className="w-full py-4 rounded-full bg-brand-600 text-white font-semibold transition-all disabled:opacity-40"
              >
                {loading ? '...' : t('sell.cta')}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('sell.whyTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-100 p-7 hover:shadow-lift transition-all"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white mb-4 group-hover:scale-110 transition-transform">
                  <Icon name={r.icon} size={26} />
                </span>
                <h3 className="text-lg font-bold text-midnight-900 mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('sell.howTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative bg-slate-50 rounded-3xl border border-slate-100 p-7 pt-10"
              >
                <span className="absolute -top-5 left-7 font-display text-6xl font-bold text-gradient opacity-25">{s.n}</span>
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white font-bold mb-4">{s.n}</span>
                  <h3 className="font-bold text-midnight-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureBar />
    </div>
  )
}
