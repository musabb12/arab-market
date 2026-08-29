import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Promotions() {
  const { t } = useTranslation()
  const { siteData, updateSite, products, toast } = useStore()
  const { content, coupons } = siteData

  const setPromo = (patch) => updateSite((prev) => ({ ...prev, content: { ...prev.content, promo: { ...prev.content.promo, ...patch } } }))

  const flashProducts = products.filter((p) => p.badges?.includes('flashSale'))
  const activeCoupons = coupons.filter((c) => c.status === 'active').length

  const toggleBadge = (p, badge) => {
    const has = p.badges?.includes(badge)
    const nextBadges = has ? p.badges.filter((b) => b !== badge) : [...(p.badges || []), badge]
    updateSite((prev) => ({ ...prev, products: prev.products.map((x) => (x.id === p.id ? { ...x, badges: nextBadges } : x)) }))
    toast(t('admin.common.saved'))
  }

  return (
    <div>
      <SectionTitle title={t('admin.promotions.title')} subtitle={t('admin.promotions.subtitle')} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.promotions.banner')} subtitle={t('admin.promotions.bannerSub')}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-midnight-900">{t('admin.promotions.bannerEnabled')}</p>
                <p className="text-xs text-slate-400">{t('admin.promotions.bannerHint')}</p>
              </div>
              <Toggle checked={content.promo.enabled !== false} onChange={(v) => setPromo({ enabled: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-midnight-900">{t('admin.promotions.activeCoupons')}</p>
                <p className="text-xs text-slate-400">{activeCoupons}</p>
              </div>
              <Badge tone="green">{activeCoupons} {t('admin.common.active')}</Badge>
            </div>
          </div>
        </Card>

        <Card title={t('admin.promotions.flashSale')} subtitle={t('admin.promotions.flashSub', { count: flashProducts.length })}>
          <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
            {products.slice(0, 24).map((p) => (
              <div key={p.id} className="flex items-center gap-3 border border-slate-100 rounded-xl p-2.5">
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-midnight-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">${p.price}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {[['flashSale', t('admin.promotions.flashSale')], ['featured', t('admin.common.new')], ['bestSeller', t('admin.nav.products')], ['newArrival', t('admin.common.new')]].map(([b, label]) => (
                    <button
                      key={b}
                      onClick={() => toggleBadge(p, b)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${p.badges?.includes(b) ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title={t('admin.promotions.preview')}>
          <div className="relative rounded-2xl overflow-hidden bg-midnight-900">
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
