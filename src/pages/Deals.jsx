import React from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid, FeatureBar } from '../components/Layout.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import { discountPercent } from '../utils/helpers.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import { Link } from 'react-router-dom'

export default function Deals() {
  const { t } = useTranslation()
  const { formatPrice, products } = useStore()

  const flash = products.filter((p) => p.badges?.includes('flashSale'))
  const withDiscount = products
    .filter((p) => p.originalPrice)
    .sort((a, b) => discountPercent(b.price, b.originalPrice) - discountPercent(a.price, a.originalPrice))

  return (
    <div>
      <PageHero title={t('deals.title')} subtitle={t('deals.subtitle')} crumb={t('nav.deals')} />
      <Breadcrumb items={[{ label: t('nav.deals') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Flash sale hero strip */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-700 via-rose-600 to-red-700 p-8 md:p-10 mb-12">
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_85%_0%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Icon name="zap" size={30} className="text-white" />
              </span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">{t('deals.flashTitle')}</h2>
                <p className="text-red-100 text-sm">{t('deals.flashSubtitle')}</p>
              </div>
            </div>
            <CountdownTimer className="text-white" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-midnight-900 mb-6">{t('deals.todayTitle')}</h2>
        <ProductGrid products={flash} cols={4} />

        <div className="mt-14 mb-6 flex items-center gap-3">
          <Icon name="tag" size={20} className="text-brand-600" />
          <h2 className="font-display text-2xl font-semibold text-midnight-900">{t('deals.upTo', { percent: 40 })}</h2>
        </div>
        <ProductGrid products={withDiscount.slice(0, 12)} cols={4} />
      </div>
      <FeatureBar />
    </div>
  )
}
