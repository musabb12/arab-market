import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import { subcategoryLabel } from '../utils/catalog.js'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const { t } = useTranslation()
  const { products, categories, brands } = useStore()
  const category = categories.find((c) => c.id === categoryId)
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-900">{t('notFound.title')}</h2>
        <Link to="/" className="text-brand-600 font-semibold mt-4 inline-block hover:underline">{t('notFound.home')}</Link>
      </div>
    )
  }

  const categoryProducts = products.filter((p) => p.category === category.id)
  const relatedBrands = brands.filter((b) => b.category === category.id)

  return (
    <div>
      <PageHero title={t(category.nameKey)} subtitle={category.description} crumb={t(category.nameKey)} image={category.image} />
      <Breadcrumb items={[{ to: '/products', label: t('products.title') }, { label: t(category.nameKey) }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {category.subcategories.map((s) => (
            <Link key={s} to={`/products?q=${encodeURIComponent(s)}`} className="text-xs px-4 py-2 rounded-full bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-midnight-900 hover:text-midnight-900 dark:hover:border-white dark:hover:text-white transition-colors">
              {subcategoryLabel(t, s)}
            </Link>
          ))}
        </div>

        {relatedBrands.length > 0 && (
          <div className="mb-10 bg-white dark:bg-midnight-900 rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-6">
            <h3 className="text-sm font-bold text-midnight-900 dark:text-white mb-4">{t('home.brandsTitle')}</h3>
            <div className="flex flex-wrap gap-3">
              {relatedBrands.map((b) => (
                <Link key={b.id} to={`/brand/${b.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-midnight-800 hover:bg-amber-50 dark:hover:bg-midnight-700 transition-colors">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${b.gradient} text-white text-xs font-bold`}>{b.logo}</span>
                  <span className="text-sm font-semibold text-midnight-900 dark:text-white" dir="ltr">{b.name}</span>
                  {b.rare && <span className="rounded-full bg-midnight-950 px-2 py-0.5 text-[10px] font-bold text-amber-300">{t('common.rare')}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-midnight-900 dark:text-white">{t('products.results', { count: categoryProducts.length })}</h2>
          <Link to={`/products?category=${category.id}`} className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
            {t('search.viewAll')}
            <Icon name="arrowRight" size={14} className="rtl:rotate-180" />
          </Link>
        </div>
        <ProductGrid products={categoryProducts} cols={4} />
      </div>
    </div>
  )
}
