import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'

const contentMap = {
  privacy: {
    key: 'privacyTitle',
    introKey: 'privacyIntro',
    count: 6,
    prefix: '',
    icon: 'shield',
    theme: 'info'
  },
  terms: {
    key: 'termsTitle',
    introKey: 'termsIntro',
    count: 5,
    prefix: 'termsSection',
    icon: 'document',
    theme: 'info'
  },
  returns: {
    key: 'returnsTitle',
    introKey: 'returnsIntro',
    count: 4,
    prefix: 'returnsSection',
    icon: 'refresh',
    theme: 'info'
  },
  shipping: {
    key: 'shippingTitle',
    introKey: 'shippingIntro',
    count: 4,
    prefix: 'shippingSection',
    icon: 'truck',
    theme: 'info'
  },
  cookies: {
    key: 'cookiesTitle',
    introKey: 'cookiesIntro',
    count: 4,
    prefix: 'cookiesSection',
    icon: 'sparkle',
    theme: 'info'
  }
}

const relatedPages = ['privacy', 'terms', 'cookies', 'returns', 'shipping']

export default function InfoPage() {
  const { page } = useParams()
  const { t, i18n } = useTranslation()
  const cfg = contentMap[page]

  const updatedLabel = useMemo(() => {
    try {
      return new Date(2026, 0, 15).toLocaleDateString(i18n.language || 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'January 15, 2026'
    }
  }, [i18n.language])

  if (!cfg) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900 dark:text-white">{t('notFound.title')}</h2>
        <Link to="/" className="text-brand-600 font-semibold mt-4 inline-block hover:underline">
          {t('notFound.home')}
        </Link>
      </div>
    )
  }

  const title = t(`info.${cfg.key}`)
  const intro = t(`info.${cfg.introKey}`)

  const sections = Array.from({ length: cfg.count }, (_, i) => {
    const n = i + 1
    return {
      n,
      title: cfg.prefix ? t(`info.${cfg.prefix}${n}Title`) : t(`info.section${n}Title`),
      text: cfg.prefix ? t(`info.${cfg.prefix}${n}Text`) : t(`info.section${n}Text`)
    }
  })

  return (
    <div>
      <PageHero title={title} subtitle={intro} crumb={title} theme={cfg.theme} />
      <Breadcrumb items={[{ label: title }]} />

      <section className="relative py-12 md:py-16 bg-slate-50 dark:bg-midnight-950">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-midnight-900 p-5 shadow-soft">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                    <Icon name={cfg.icon} size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">{t('info.policyNav')}</p>
                    <p className="text-sm font-bold text-midnight-900 dark:text-white leading-snug">{title}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {t('info.lastUpdated', { date: updatedLabel })}
                </p>
                <nav className="space-y-1">
                  {relatedPages.map((id) => {
                    const active = id === page
                    const label = t(`info.${contentMap[id].key}`)
                    return (
                      <Link
                        key={id}
                        to={`/info/${id}`}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? 'bg-brand-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <Icon name={contentMap[id].icon} size={14} />
                        {label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-midnight-900 p-5 text-white">
                <p className="font-display text-lg font-semibold mb-2">{t('info.needHelpTitle')}</p>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{t('info.needHelpText')}</p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-brand-600 text-sm font-semibold hover:brightness-110 transition-all"
                >
                  <Icon name="headset" size={16} />
                  {t('help.contactSupport')}
                </Link>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-[1.75rem] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-midnight-900 shadow-soft overflow-hidden"
            >
              <div className="border-b border-slate-100 dark:border-white/10 px-6 md:px-10 py-7 bg-gradient-to-l from-brand-50/80 via-white to-white dark:from-brand-950/40 dark:via-midnight-900 dark:to-midnight-900">
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {intro}
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/10">
                {sections.map((s, i) => (
                  <motion.section
                    key={s.n}
                    id={`section-${s.n}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: (i % 4) * 0.04 }}
                    className="px-6 md:px-10 py-7 md:py-8"
                  >
                    <div className="flex gap-4 md:gap-5">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-midnight-900 dark:bg-brand-600 text-white text-xs font-bold">
                        {String(s.n).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-display text-xl md:text-2xl font-semibold text-midnight-900 dark:text-white mb-2.5">
                          {s.title}
                        </h2>
                        <p className="text-sm md:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>

              <div className="px-6 md:px-10 py-7 bg-slate-50 dark:bg-midnight-950/60 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:brightness-110 transition-all"
                >
                  <Icon name="headset" size={16} />
                  {t('help.contactSupport')}
                </Link>
                <Link
                  to="/help"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/15 text-sm font-semibold text-midnight-900 dark:text-white hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  {t('nav.help')}
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/15 text-sm font-semibold text-midnight-900 dark:text-white hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </div>
  )
}
