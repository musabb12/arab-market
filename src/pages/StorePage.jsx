import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb, ProductGrid } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import Icon from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'

export default function StorePage() {
  const { sellerId } = useParams()
  const { t } = useTranslation()
  const { formatPrice, sellers, products } = useStore()
  const seller = sellers.find((s) => s.id === sellerId) || sellers[0]
  const list = products.filter((p) => p.sellerId === seller.id)

  const stats = [
    { icon: 'chart', label: t('store.rating'), value: seller.rating.toFixed(1) },
    { icon: 'user', label: t('store.followers'), value: seller.followers.toLocaleString() },
    { icon: 'clock', label: t('store.response'), value: seller.response },
    { icon: 'box', label: t('store.products'), value: list.length }
  ]

  return (
    <div>
      <PageHero title={seller.name} subtitle={t('store.title')} crumb={seller.name}  theme="store" />
      <Breadcrumb items={[{ label: t('store.title') }]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden mb-10">
          <div className="relative h-40 bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-700">
            <div className="absolute inset-0 bg-[radial-gradient(700px_250px_at_80%_0%,rgba(255,255,255,0.2),transparent_60%)]" />
          </div>
          <div className="px-7 pb-7">
            <div className="flex flex-wrap items-end justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <img src={seller.image} alt={seller.name} className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lift" />
                <div className="pb-1">
                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-midnight-900">
                    {seller.name}
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <Icon name="check" size={10} />
                      {t('store.verified')}
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1.5"><StarRating rating={seller.rating} size={13} /><b className="text-midnight-900">{seller.rating}</b></span>
                    <span><Icon name="mapPin" size={13} className="inline" /> {seller.country}</span>
                    <span>{t('store.joined')} {seller.since}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pb-1">
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  {t('store.follow')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 border border-slate-100">
                    <Icon name={s.icon} size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-midnight-900 truncate">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-midnight-900 mb-6">{t('store.bestSellers')}</h2>
        <ProductGrid products={list} cols={4} />
      </div>
    </div>
  )
}
