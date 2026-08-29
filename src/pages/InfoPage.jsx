import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'

const contentMap = {
  privacy: { key: 'privacyTitle', count: 6, prefix: '' },
  terms: { key: 'termsTitle', count: 5, prefix: 'termsSection' },
  returns: { key: 'returnsTitle', count: 4, prefix: 'returnsSection' },
  shipping: { key: 'shippingTitle', count: 4, prefix: 'shippingSection' },
  cookies: { key: 'cookiesTitle', count: 4, prefix: 'cookiesSection' }
}

export default function InfoPage() {
  const { page } = useParams()
  const { t } = useTranslation()
  const cfg = contentMap[page]

  if (!cfg) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900">{t('notFound.title')}</h2>
        <Link to="/" className="text-brand-600 font-semibold mt-4 inline-block hover:underline">{t('notFound.home')}</Link>
      </div>
    )
  }

  const title = t(`info.${cfg.key}`)

  return (
    <div>
      <PageHero title={title} crumb={title}  theme="info" />
      <Breadcrumb items={[{ label: title }]} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-sm text-slate-400 mb-10">{t('info.lastUpdated', { date: 'January 2026' })}</p>
        <div className="space-y-6">
          {Array.from({ length: cfg.count }, (_, i) => {
            const n = i + 1
            const sTitle = cfg.prefix ? t(`info.${cfg.prefix}${n}Title`) : t(`info.section${n}Title`)
            const sText = cfg.prefix ? t(`info.${cfg.prefix}${n}Text`) : t(`info.section${n}Text`)
            return (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (n % 3) * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6"
              >
                <h2 className="flex items-center gap-3 font-bold text-midnight-900 mb-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-xs font-bold">
                    {n}
                  </span>
                  {sTitle}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{sText}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">
            <Icon name="headset" size={16} />
            {t('help.contactSupport')}
          </Link>
          <Link to="/help" className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-colors">
            {t('nav.help')}
          </Link>
        </div>
      </div>
    </div>
  )
}
