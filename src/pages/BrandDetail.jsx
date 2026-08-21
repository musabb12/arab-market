import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function BrandDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const { products, brands, categories } = useStore()
  const brand = brands.find((b) => b.id === id)
  if (!brand) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900">{t('notFound.title')}</h2>
        <Link to="/brands" className="text-brand-600 font-semibold mt-4 inline-block hover:underline">{t('nav.brands')}</Link>
      </div>
    )
  }

  const list = products.filter((p) => p.brand === brand.id)
  const cat = categories.find((c) => c.id === brand.category)
  const store = products.find((p) => p.brand === brand.id)

  return (
    <div>
      <PageHero title={brand.name} subtitle={brand.description} crumb={brand.name} />
      <Breadcrumb items={[{ to: '/brands', label: t('nav.brands') }, { label: brand.name }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden mb-10">
          <div className={`h-40 bg-gradient-to-br ${brand.gradient} relative`}>
            <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_70%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
          </div>
          <div className="px-7 pb-7">
            <div className="flex flex-wrap items-end justify-between gap-4 -mt-10">
              <div className="flex items-end gap-4">
                <span className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${brand.gradient} text-white text-3xl font-bold shadow-lift border-4 border-white`}>
                  {brand.logo}
                </span>
                <div className="pb-1">
                  <h2 className="font-display text-2xl font-bold text-midnight-900">{brand.name}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Icon name="mapPin" size={13} />
                    {brand.country}
                    {cat && <> · {t(cat.nameKey)}</>}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pb-1">
                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  {t('store.follow')}
                </button>
                {store && (
                  <Link to={`/store/${store.sellerId}`} className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-colors">
                    {t('store.title')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-midnight-900 mb-6">{t('products.title')}</h2>
        <ProductGrid products={list} cols={4} />
      </div>
    </div>
  )
}
