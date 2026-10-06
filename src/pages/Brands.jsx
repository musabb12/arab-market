import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function Brands() {
  const { t } = useTranslation()
  const { brands, categories, products } = useStore()

  return (
    <div>
      <PageHero title={t('brands.title')} subtitle={t('brands.subtitle')} crumb={t('nav.brands')}  theme="brands" />
      <Breadcrumb items={[{ label: t('nav.brands') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b, i) => {
            const count = products.filter((p) => p.brand === b.id).length
            const cat = categories.find((c) => c.id === b.category)
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              >
                <Link to={`/brand/${b.id}`} className="group relative bg-white dark:bg-midnight-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-soft overflow-hidden hover:shadow-lift transition-all p-7 flex flex-col">
                  <div className={`absolute -top-8 -right-8 h-32 w-32 rounded-full ${b.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="flex items-start justify-between mb-5">
                    <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${b.gradient} text-white text-2xl font-bold shadow-soft group-hover:scale-110 transition-transform`}>
                      {b.logo}
                    </span>
                    <span className="flex flex-col items-end gap-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{b.country}</span>
                      {b.rare && <span className="rounded-full bg-midnight-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">{t('common.rare')}</span>}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-midnight-900 dark:text-white group-hover:text-brand-600 transition-colors mb-2">{b.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">{b.description}</p>
                  <div className="flex items-center justify-between">
                    {cat && <span className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">{t(cat.nameKey)}</span>}
                    <span className="flex items-center gap-2 text-sm font-semibold text-brand-600">
                      {count > 0 && <>{count} {t('brands.productsCount', { count: 0 }).split(' ')[0]}</>}
                      {t('brands.visitStore')}
                      <Icon name="arrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
