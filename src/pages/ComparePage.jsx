import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHero, Breadcrumb, EmptyState } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

export default function ComparePage() {
  const { t } = useTranslation()
  const { compare, toggleCompare, addToCart, formatPrice } = useStore()

  const rows = [
    { key: 'price', label: t('compare.price'), render: (p) => <b>{formatPrice(p.price)}</b> },
    { key: 'brand', label: t('compare.brand'), render: (p) => getBrand(p.brand).name },
    { key: 'rating', label: t('compare.rating'), render: (p) => <span className="flex items-center justify-center gap-1.5"><StarRating rating={p.rating} size={13} />{p.rating}</span> },
    { key: 'reviews', label: t('common.reviews', { count: 0 }).split(' ')[0], render: (p) => p.reviews.toLocaleString() },
    { key: 'shipping', label: t('compare.shipping'), render: () => <span className="text-emerald-600 font-medium">{t('compare.free')}</span> }
  ]

  return (
    <div>
      <PageHero title={t('compare.title')} subtitle={t('categories.subtitle')} crumb={t('compare.title')} />
      <Breadcrumb items={[{ label: t('compare.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {compare.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft">
            <EmptyState
              icon="compare"
              title={t('compare.empty')}
              subtitle={t('compare.emptySub')}
              action={
                <Link to="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold">
                  {t('compare.browse')}
                </Link>
              }
            />
          </div>
        ) : compare.length === 1 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-12 text-center">
            <Icon name="compare" size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-semibold text-midnight-900 mb-2">{t('compare.noItems')}</h3>
            <Link to="/products" className="text-brand-600 font-semibold hover:underline">{t('compare.browse')}</Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-5 w-40 text-left text-xs font-bold uppercase tracking-wider text-slate-400">{t('common.filters')}</th>
                  {compare.map((p) => (
                    <th key={p.id} className="p-5 text-center min-w-[200px] align-top">
                      <div className="relative">
                        <button onClick={() => toggleCompare(p)} className="absolute top-0 right-0 p-1.5 text-slate-300 hover:text-red-600 transition-colors" aria-label={t('compare.remove')}>
                          <Icon name="close" size={16} />
                        </button>
                        <img src={p.image} alt={p.name} className="h-36 w-full object-cover rounded-2xl mb-3" />
                        <Link to={`/product/${p.id}`} className="block text-sm font-semibold text-midnight-900 hover:text-brand-600 transition-colors leading-snug">{p.name}</Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-slate-50">
                    <td className="p-5 text-sm font-semibold text-slate-500">{row.label}</td>
                    {compare.map((p) => (
                      <td key={p.id} className="p-5 text-center text-sm text-midnight-900">{row.render(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-5" />
                  {compare.map((p) => (
                    <td key={p.id} className="p-5 text-center">
                      <button onClick={() => addToCart(p)} className="px-5 py-2.5 rounded-full bg-midnight-900 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
                        {t('compare.addToCart')}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
