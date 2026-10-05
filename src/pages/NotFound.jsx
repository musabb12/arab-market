import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Icon from '../components/Icons.jsx'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="relative overflow-hidden bg-midnight-900 -mt-[var(--site-nav-h)] min-h-[70vh] flex items-center justify-center pt-[var(--site-nav-h)]">
      <div className="relative text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-8xl md:text-9xl font-bold text-gradient leading-none mb-4"
          >
            404
          </motion.p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3">{t('notFound.title')}</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-8">{t('notFound.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="px-8 py-4 rounded-full bg-brand-600 text-white font-semibold flex items-center gap-2 transition-all">
              <Icon name="home" size={18} />
              {t('notFound.home')}
            </Link>
            <Link to="/products" className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors">
              {t('notFound.search')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
