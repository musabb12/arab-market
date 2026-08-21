import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'

export default function SearchPage() {
  const { t } = useTranslation()
  const { products, categories } = useStore()
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const results = useMemo(() => {
    if (!q) return []
    const needle = q.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.specs.some((s) => s.toLowerCase().includes(needle)) ||
        p.category.includes(needle)
    )
  }, [q, products])

  return (
    <div>
      <PageHero title={t('search.results')} subtitle={q ? `"${q}"` : ''} crumb={t('search.button')} />
      <Breadcrumb items={[{ label: t('search.results') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {results.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft py-20 px-8 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-5">
              <Icon name="search" size={32} className="text-slate-300" />
            </span>
            <h3 className="font-display text-2xl font-semibold text-midnight-900 mb-2">{t('search.noResults')} "{q}"</h3>
            <p className="text-slate-500 mb-8">{t('search.tryDifferent')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <Link key={c.id} to={`/category/${c.id}`} className="px-4 py-2 rounded-full bg-slate-100 text-sm font-medium text-midnight-900 hover:bg-brand-600 hover:text-white transition-colors">
                  {t(c.nameKey)}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">{t('products.results', { count: results.length })}</p>
            <ProductGrid products={results} cols={4} />
          </>
        )}
      </div>
    </div>
  )
}
