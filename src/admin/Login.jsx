import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icons.jsx'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const { adminLogin } = useStore()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const ok = await adminLogin(username.trim(), password)
    if (ok) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Invalid credentials. Try admin / admin123')
    }
  }

  const input = 'w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all bg-white'

  return (
    <div className="min-h-screen bg-midnight-900 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_80%_-10%,rgba(99,102,241,0.25),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-lift p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 shadow-glow">
              <Icon name="shield" size={22} className="text-white" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold text-midnight-900">ARAB Market Admin</h1>
              <p className="text-xs text-slate-400">Sign in to the control center</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <Icon name="info" size={16} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className={input} placeholder="admin" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold hover:shadow-glow transition-all flex items-center justify-center gap-2">
              <Icon name="lock" size={16} />
              Sign in
            </button>
          </form>

          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
            <p className="font-semibold text-midnight-900 mb-1">Demo credentials</p>
            <p>Admin: <span className="font-mono font-semibold text-brand-600">admin</span> / <span className="font-mono font-semibold text-brand-600">admin123</span></p>
            <p>Manager: <span className="font-mono font-semibold text-brand-600">manager</span> / <span className="font-mono font-semibold text-brand-600">manager123</span></p>
            <p className="mt-2 text-slate-400">Requires API server (`npm run dev:all`)</p>
          </div>
        </div>
        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
            <Icon name="arrowRight" size={15} className="rotate-180" />
            {t('common.backHome') || 'Back to storefront'}
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
