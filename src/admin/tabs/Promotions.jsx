import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge, SearchInput, AdminCardGrid, AdminEntityCard } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

const BADGE_KEYS = ['flashSale', 'featured', 'bestSeller', 'newArrival']

export default function Promotions() {
  const { t } = useTranslation()
  const { siteData, updateSite, products, toast, formatPrice } = useStore()
  const { content, coupons } = siteData
  const [q, setQ] = useState('')

  const setPromo = (patch) => updateSite((prev) => ({ ...prev, content: { ...prev.content, promo: { ...prev.content.promo, ...patch } } }))

  const flashProducts = products.filter((p) => p.badges?.includes('flashSale'))
  const activeCoupons = coupons.filter((c) => c.status === 'active').length

  const list = useMemo(() => {
    if (!q) return products.slice(0, 24)
    return products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 24)
  }, [products, q])

  const toggleBadge = (p, badge) => {
    const has = p.badges?.includes(badge)
    const nextBadges = has ? p.badges.filter((b) => b !== badge) : [...(p.badges || []), badge]
    updateSite((prev) => ({ ...prev, products: prev.products.map((x) => (x.id === p.id ? { ...x, badges: nextBadges } : x)) }))
    toast(t('admin.common.saved'))
  }

  return (
    <div>
      <SectionTitle title={t('admin.promotions.title')} subtitle={t('admin.promotions.subtitle')} />

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card title={t('admin.promotions.banner')} subtitle={t('admin.promotions.bannerSub')} className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand-50 to-indigo-50 p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-midnight-900">{t('admin.promotions.bannerEnabled')}</p>
                <p className="text-xs text-slate-500 mt-1">{t('admin.promotions.bannerHint')}</p>
              </div>
              <Toggle checked={content.promo.enabled !== false} onChange={(v) => setPromo({ enabled: v })} />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-midnight-900">{t('admin.promotions.activeCoupons')}</p>
                <p className="text-xs text-slate-500 mt-1">{activeCoupons}</p>
              </div>
              <Badge tone="green">{activeCoupons} {t('admin.common.active')}</Badge>
            </div>
          </div>
        </Card>

        <Card title={t('admin.promotions.flashSale')} subtitle={t('admin.promotions.flashSub', { count: flashProducts.length })}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-glow">
              <Icon name="zap" size={22} />
            </span>
            <div>
              <p className="text-2xl font-bold text-midnight-900">{flashProducts.length}</p>
              <p className="text-xs text-slate-500">{t('admin.promotions.flashSale')}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-5">
        <SearchInput value={q} onChange={setQ} placeholder={t('admin.products.search')} />
      </Card>

      <AdminCardGrid>
        {list.map((p) => {
          const activeBadges = BADGE_KEYS.filter((b) => p.badges?.includes(b))
          return (
            <AdminEntityCard
              key={p.id}
              image={p.image}
              imageAlt={p.name}
              title={p.name}
              subtitle={formatPrice ? formatPrice(p.price) : `$${p.price}`}
              topBadges={activeBadges.map((b) => ({
                label: t(`admin.promotions.badges.${b}`),
                tone: b === 'flashSale' ? 'amber' : b === 'featured' ? 'purple' : 'blue'
              }))}
              meta={[
                { label: t('admin.common.price'), value: formatPrice ? formatPrice(p.price) : `$${p.price}` },
                { label: t('admin.common.stock'), value: p.stock }
              ]}
            >
              <div className="mt-3 flex flex-wrap gap-1.5">
                {BADGE_KEYS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(p, b)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                      p.badges?.includes(b)
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {t(`admin.promotions.badges.${b}`)}
                  </button>
                ))}
              </div>
            </AdminEntityCard>
          )
        })}
      </AdminCardGrid>

      <div className="mt-6">
        <Card title={t('admin.promotions.preview')}>
          <div className="relative rounded-2xl overflow-hidden bg-midnight-900 min-h-[220px]">
            <img src={content.promo.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative px-6 py-10 text-center">
              <span className="inline-block bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {content.promo.badge}
              </span>
              <h3 className="font-display text-2xl font-semibold text-white mb-2">{content.promo.title}</h3>
              <p className="text-slate-300 text-sm mb-5">{content.promo.subtitle}</p>
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-sm font-semibold">
                <Icon name="zap" size={15} />
                {content.promo.cta}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
