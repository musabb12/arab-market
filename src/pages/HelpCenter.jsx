import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, FeatureBar } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'

export default function HelpCenter() {
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(0)

  const topics = [
    { icon: 'user', title: t('help.topic1Title'), text: t('help.topic1Text') },
    { icon: 'cart', title: t('help.topic2Title'), text: t('help.topic2Text') },
    { icon: 'truck', title: t('help.topic3Title'), text: t('help.topic3Text') },
    { icon: 'refresh', title: t('help.topic4Title'), text: t('help.topic4Text') },
    { icon: 'lock', title: t('help.topic5Title'), text: t('help.topic5Text') },
    { icon: 'store', title: t('help.topic6Title'), text: t('help.topic6Text') }
  ]

  const faqs = [
    { q: t('help.faq1q'), a: t('help.faq1a') },
    { q: t('help.faq2q'), a: t('help.faq2a') },
    { q: t('help.faq3q'), a: t('help.faq3a') },
    { q: t('help.faq4q'), a: t('help.faq4a') },
    { q: t('help.faq5q'), a: t('help.faq5a') },
    { q: t('help.faq6q'), a: t('help.faq6a') }
  ]

  const filteredFaqs = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <PageHero title={t('help.title')} subtitle={t('help.subtitle')} crumb={t('nav.help')}  theme="help" />
      <Breadcrumb items={[{ label: t('nav.help') }]} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="max-w-lg mx-auto relative mb-12">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('help.searchPlaceholder')}
            className="w-full border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all"
          />
          <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">{t('help.browseTitle')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:shadow-lift hover:-translate-y-0.5 transition-all"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 mb-3">
                  <Icon name={topic.icon} size={20} />
                </span>
                <h3 className="font-bold text-midnight-900 text-sm mb-1">{topic.title}</h3>
                <p className="text-xs text-slate-500">{topic.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">{t('help.faqTitle')}</h2>
          <div className="space-y-3">
            {filteredFaqs.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-midnight-900 text-sm pr-4">{f.q}</span>
                  <Icon name="chevronDown" size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${open === i ? 'pb-5 max-h-40' : 'max-h-0'}`}>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-midnight-900 rounded-3xl p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-white mb-2">{t('help.stillNeedTitle')}</h3>
          <p className="text-brand-100 text-sm mb-6">{t('help.stillNeedText')}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-midnight-800 font-semibold hover:bg-brand-50 transition-colors">
            <Icon name="headset" size={18} />
            {t('help.contactSupport')}
          </Link>
        </div>
      </div>
      <FeatureBar />
    </div>
  )
}
