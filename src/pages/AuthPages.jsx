import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { api } from '../api/client.js'
import Icon from '../components/Icons.jsx'

function AuthShell({ title, subtitle, children, side }) {
  return (
    <div className="relative overflow-hidden min-h-[80vh] bg-white">
      <div className="absolute inset-0 bg-hero-mesh opacity-40" />
      <div className="relative max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <img src={side.image} alt="" className="rounded-3xl shadow-lift aspect-[4/5] object-cover w-full max-w-md mx-auto" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lift">
              <p className="font-display text-lg font-semibold text-midnight-900 mb-1">{side.quote}</p>
              <p className="text-xs text-slate-500">{side.author}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
            <h1 className="font-display text-2xl font-bold text-midnight-900 mb-1">{title}</h1>
            <p className="text-sm text-slate-500 mb-7">{subtitle}</p>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const sideImages = {
  login: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    quote: 'Premium shopping, delivered worldwide.',
    author: 'ARAB Market'
  },
  register: {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
    quote: 'Join millions of happy shoppers.',
    author: 'ARAB Community'
  }
}

const input = 'w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, apiOnline } = useStore()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!apiOnline) throw new Error('Server offline. Start the API with npm run dev:all')
      const u = await login({ email: form.email, password: form.password })
      if (u.role === 'seller') navigate('/seller')
      else navigate('/account')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')} side={sideImages.login}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.email')}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={input} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-500">{t('auth.password')}</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:underline">{t('auth.forgotPassword')}</Link>
          </div>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="h-4 w-4 rounded border-slate-300 accent-brand-600" />
          {t('auth.rememberMe')}
        </label>
        <button type="submit" disabled={loading} className="w-full py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all disabled:opacity-60">
          {loading ? '...' : t('auth.signIn')}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        {t('auth.noAccount')} <Link to="/register" className="font-semibold text-brand-600 hover:underline">{t('auth.createOne')}</Link>
      </p>
      <p className="text-center text-xs text-slate-400 mt-3">
        Want to sell? <Link to="/sell" className="text-brand-600 font-semibold hover:underline">Apply as a merchant</Link>
      </p>
    </AuthShell>
  )
}

export function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register, apiOnline } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: true })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      if (!apiOnline) throw new Error('Server offline. Start the API with npm run dev:all')
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/account')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')} side={sideImages.register}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.name')}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" className={input} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.email')}</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={input} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.password')}</label>
            <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={input} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.confirmPassword')}</label>
            <input type="password" required minLength={6} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" className={input} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} className="h-4 w-4 rounded border-slate-300 accent-brand-600" />
          {t('auth.agreeTerms')}
        </label>
        <button type="submit" disabled={!form.agree || form.password !== form.confirm || loading} className="w-full py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all disabled:opacity-40">
          {loading ? '...' : t('auth.createAccount')}
        </button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6">
        {t('auth.haveAccount')} <Link to="/login" className="font-semibold text-brand-600 hover:underline">{t('auth.signIn')}</Link>
      </p>
    </AuthShell>
  )
}

export function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  return (
    <AuthShell title={t('auth.resetTitle')} subtitle={t('auth.resetSubtitle')} side={sideImages.login}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      {sent ? (
        <div className="text-center py-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <Icon name="check" size={28} />
          </span>
          <p className="text-sm text-slate-600">{t('auth.resetSent')}</p>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            try {
              await api.forgotPassword({ email })
              setSent(true)
            } catch (err) {
              setError(err.message || 'Request failed')
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t('auth.email')}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
          </div>
          <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all">
            {t('auth.sendReset')}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-slate-500 mt-6">
        <Link to="/login" className="font-semibold text-brand-600 hover:underline flex items-center justify-center gap-1">
          <Icon name="arrowRight" size={14} className="rotate-180" />
          {t('auth.backToLogin')}
        </Link>
      </p>
    </AuthShell>
  )
}
