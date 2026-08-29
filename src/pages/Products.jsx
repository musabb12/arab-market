import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { getBrand, getCategory } from '../utils/helpers.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

const PER_PAGE = 12

export default function Products() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const { formatPrice, products, categories, brands } = useStore()

  const cat = params.get('category') || 'all'
  const brand = params.get('brand') || 'all'
  const q = params.get('q') || ''
  const minP = Number(params.get('min')) || 0
  const maxP = Number(params.get('max')) || 5000
  const minR = Number(params.get('rating')) || 0
  const sort = params.get('sort') || 'featured'
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = [...products]
    if (cat !== 'all') list = list.filter((p) => p.category === cat)
    if (brand !== 'all') list = list.filter((p) => p.brand === brand)
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))
    list = list.filter((p) => p.price >= minP && p.price <= maxP)
    if (minR > 0) list = list.filter((p) => p.rating >= minR)
    switch (sort) {
      case 'priceLow': list.sort((a, b) => a.price - b.price); break
      case 'priceHigh': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'newest': list.sort((a, b) => (b.badges?.includes('newArrival') ? 1 : 0) - (a.badges?.includes('newArrival') ? 1 : 0)); break
      default: list.sort((a, b) => (b.badges?.length || 0) - (a.badges?.length || 0))
    }
    return list
  }, [cat, brand, q, minP, maxP, minR, sort, products])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
    setPage(1)
  }

  const priceOptions = [
    { label: t('products.minPrice'), key: 'min' },
    { label: t('products.maxPrice'), key: 'max' }
  ]

  return (
    <div>
      <PageHero title={q ? t('search.results') : t('products.title')} subtitle={t('categories.subtitle')} crumb={t('nav.categories')}  theme="products" />
      <Breadcrumb items={[{ label: t('products.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-7">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-midnight-900 flex items-center gap-2">
                <Icon name="filter" size={16} />
                {t('common.filters')}
              </h3>
              <button onClick={() => setParams({}, { replace: true })} className="text-xs text-brand-600 hover:underline">
                {t('common.reset')}
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-midnight-900 mb-3">{t('common.category')}</h4>
              <div className="space-y-1.5">
                <FilterItem active={cat === 'all'} onClick={() => setFilter('category', 'all')} label={t('products.all')} />
                {categories.map((c) => (
                  <FilterItem key={c.id} active={cat === c.id} onClick={() => setFilter('category', c.id)} label={t(c.nameKey)} count={products.filter((p) => p.category === c.id).length} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-midnight-900 mb-3">{t('common.brand')}</h4>
              <div className="space-y-1.5">
                {brands.slice(0, 8).map((b) => (
                  <FilterItem key={b.id} active={brand === b.id} onClick={() => setFilter('brand', b.id)} label={b.name} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-midnight-900 mb-3">{t('products.priceRange')}</h4>
              <div className="flex items-center gap-2 mb-2">
                {priceOptions.map((o) => (
                  <input
                    key={o.key}
                    type="number"
                    placeholder={o.label}
                    value={params.get(o.key) || ''}
                    onChange={(e) => setFilter(o.key, e.target.value)}
                    className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{formatPrice(minP)}</span>
                <span>{formatPrice(maxP)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-midnight-900 mb-3">{t('common.rating')}</h4>
              <div className="space-y-1.5">
                {[4.5, 4, 3.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilter('rating', minR === r ? '' : r)}
                    className={`flex items-center gap-2 w-full text-sm py-1 rounded-lg px-2 transition-colors ${minR === r ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <StarRating rating={r} size={13} />
                    <span>& up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-sm text-slate-500">
              {t('products.results', { count: filtered.length })}
              {cat !== 'all' && (
                <span className="text-midnight-900 font-medium"> · {t(getCategory(cat).nameKey)}</span>
              )}
              {brand !== 'all' && (
                <span className="text-midnight-900 font-medium"> · {getBrand(brand).name}</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{t('common.sortBy')}</span>
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-brand-400 cursor-pointer"
              >
                <option value="featured">{t('products.sortFeatured')}</option>
                <option value="newest">{t('products.sortNewest')}</option>
                <option value="priceLow">{t('products.sortPriceLow')}</option>
                <option value="priceHigh">{t('products.sortPriceHigh')}</option>
                <option value="rating">{t('products.sortRating')}</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
              <Icon name="search" size={40} className="mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-midnight-900 mb-1">{t('search.noResults')}</h3>
              <p className="text-sm text-slate-500">{t('search.tryDifferent')}</p>
            </div>
          ) : (
            <ProductGrid products={pageItems} cols={3} />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 disabled:opacity-40 hover:border-brand-400 transition-colors"
                aria-label="Previous"
              >
                <Icon name="chevronRight" size={16} className="rotate-180" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-10 w-10 rounded-xl text-sm font-semibold transition-colors ${n === page ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:border-brand-400'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 disabled:opacity-40 hover:border-brand-400 transition-colors"
                aria-label="Next"
              >
                <Icon name="chevronRight" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterItem({ active, onClick, label, count }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-between w-full text-sm py-1.5 rounded-lg px-2 transition-colors ${active ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
      <span className="flex items-center gap-2">
        <span className={`h-3.5 w-3.5 rounded-full border transition-colors ${active ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`} />
        {label}
      </span>
      {count != null && <span className="text-xs text-slate-400">{count}</span>}
    </button>
  )
}
