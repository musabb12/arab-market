import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import CountdownTimer from '../components/CountdownTimer.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function NewArrivals() {
  const { t } = useTranslation()
  const { products } = useStore()
  const list = products.filter((p) => p.badges?.includes('newArrival'))

  return (
    <div>
      <PageHero title={t('nav.newArrivals')} subtitle={t('home.newSubtitle')} crumb={t('nav.newArrivals')}  theme="new" />
      <Breadcrumb items={[{ label: t('nav.newArrivals') }]} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductGrid products={list} cols={4} />
      </div>
    </div>
  )
}
