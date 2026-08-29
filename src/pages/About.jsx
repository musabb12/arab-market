import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, FeatureBar } from '../components/Layout.jsx'
import Icon from '../components/Icons.jsx'

const team = [
  { name: 'Elena Vasquez', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Omar Al Rashid', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Sophie Laurent', role: 'Chief Product Officer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kenji Nakamura', role: 'Chief Operations Officer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' }
]

const offices = [
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80' },
  { city: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80' },
  { city: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80' }
]

export default function About() {
  const { t } = useTranslation()

  const values = [
    { icon: 'heart', title: t('about.value1Title'), text: t('about.value1Text') },
    { icon: 'sparkle', title: t('about.value2Title'), text: t('about.value2Text') },
    { icon: 'shield', title: t('about.value3Title'), text: t('about.value3Text') },
    { icon: 'globe', title: t('about.value4Title'), text: t('about.value4Text') }
  ]

  const stats = [
    { value: '2018', label: t('about.year') },
    { value: '12,000+', label: t('about.employees') },
    { value: '30+', label: t('about.cities') },
    { value: '50K+', label: t('about.partners') }
  ]

  return (
    <div>
      <PageHero title={t('about.title')} subtitle={t('about.subtitle')} crumb={t('footer.about')}  theme="about" />
      <Breadcrumb items={[{ label: t('footer.about') }]} />

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-6">{t('about.storyTitle')}</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>{t('about.story1')}</p>
              <p>{t('about.story2')}</p>
              <p>{t('about.story3')}</p>
            </div>
            <div className="mt-8 p-5 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl">
              <p className="font-display text-lg font-semibold text-midnight-900 italic">"{t('about.missionText')}"</p>
              <p className="text-sm text-brand-600 font-semibold mt-2 uppercase tracking-widest">{t('about.missionTitle')}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" alt="Our team" className="rounded-3xl shadow-lift aspect-[4/3] object-cover w-full" />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lift px-6 py-4 hidden md:block">
              <p className="font-display text-3xl font-bold text-gradient">300M+</p>
              <p className="text-xs text-slate-500">{t('home.statsShoppers')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-midnight-900 py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-100 p-7 hover:shadow-lift transition-all">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform">
                  <Icon name={v.icon} size={26} />
                </span>
                <h3 className="text-lg font-bold text-midnight-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('about.teamTitle')}</h2>
            <p className="text-slate-500">{t('about.teamSubtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-lift transition-all">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-midnight-900">{m.name}</h3>
                  <p className="text-sm text-brand-600 mt-0.5">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 mb-3">{t('about.officeTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((o, i) => (
              <motion.div key={o.city} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="relative rounded-3xl overflow-hidden group">
                <img src={o.image} alt={o.city} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-display text-xl font-semibold text-white">{o.city}</p>
                  <p className="text-sm text-slate-300">{o.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="pb-16 md:pb-20 px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-700 via-indigo-700 to-purple-800 py-16 text-center px-8">
          <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_80%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">{t('about.careersTitle')}</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto">{t('about.careersText')}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors">
              {t('about.careersCta')}
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <FeatureBar />
    </div>
  )
}
