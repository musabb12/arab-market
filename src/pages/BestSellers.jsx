import React from 'react'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function BestSellers() {
  const { t } = useTranslation()
  const { products } = useStore()
  const list = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 16)

  return (
    <div>
      <PageHero title={t('nav.bestSellers')} subtitle={t('home.bestSubtitle')} crumb={t('nav.bestSellers')}  theme="bestsellers" />
      <Breadcrumb items={[{ label: t('nav.bestSellers') }]} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid products={list} cols={4} />
      </div>
    </div>
  )
}
