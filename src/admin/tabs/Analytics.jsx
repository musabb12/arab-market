import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Stat, Bar } from '../ui.jsx'

const REVENUE = [28, 41, 35, 52, 46, 61, 55, 68, 63, 79, 74, 92]
const ORDERS = [120, 185, 150, 240, 210, 320, 260, 340, 300, 410, 380, 460]

function Lines({ data, color, label }) {
  const w = 700
  const h = 200
  const max = Math.max(...data)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / max) * (h - 30) - 15])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#f1f5f9" />)}
        <path d={area} fill={color} fillOpacity="0.12" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between mt-2 text-[11px] text-slate-400 px-1">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  )
}

export default function Analytics() {
  const { t } = useTranslation()
  const { products, orders, users, coupons } = useStore()

  const topProducts = [...products]
    .sort((a, b) => (b.sales || b.reviews) - (a.sales || a.reviews))
    .slice(0, 8)
  const maxSales = Math.max(...topProducts.map((p) => p.sales || p.reviews), 1)

  const revenue = REVENUE.reduce((s, v) => s + v, 0) * 1000
  const ordersCount = ORDERS.reduce((s, v) => s + v, 0)

  return (
    <div>
      <SectionTitle title={t('admin.analytics.title')} subtitle={t('admin.analytics.subtitle')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat icon="creditCard" label={t('admin.dashboard.revenue')} value={`$${revenue.toLocaleString()}`} delta={18.2} color="bg-emerald-600" />
        <Stat icon="cart" label={t('admin.dashboard.orders')} value={ordersCount.toLocaleString()} delta={9.4} color="bg-brand-600" />
        <Stat icon="user" label={t('admin.dashboard.customers')} value={users.length.toLocaleString()} delta={0.8} color="bg-midnight-700" />
        <Stat icon="globe" label={t('admin.nav.analytics')} value="3.42%" delta={-2.1} color="bg-amber-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card title={t('admin.analytics.revenueTrend')} subtitle={t('admin.analytics.revenueTrendSub')}>
          <Lines data={REVENUE} color="#e04418" label="rev" />
        </Card>
        <Card title={t('admin.analytics.orderVolume')} subtitle={t('admin.analytics.orderVolumeSub')}>
          <Lines data={ORDERS} color="#8b5cf6" label="ord" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.analytics.topProducts')} subtitle={t('admin.analytics.topProductsSub')}>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-center text-sm font-bold text-slate-300">{i + 1}</span>
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-midnight-900 truncate">{p.name}</p>
                  <div className="mt-1"><Bar value={p.sales || p.reviews} max={maxSales} /></div>
                </div>
                <span className="text-sm font-bold text-midnight-900">{(p.sales || p.reviews).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title={t('admin.analytics.traffic')}>
            <div className="space-y-3">
              {[
                { label: 'Organic search', value: 46, color: 'bg-brand-500' },
                { label: 'Direct', value: 24, color: 'bg-emerald-500' },
                { label: 'Social media', value: 17, color: 'bg-midnight-700' },
                { label: 'Referral', value: 9, color: 'bg-amber-500' },
                { label: 'Email', value: 4, color: 'bg-rose-500' }
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-500">{s.label}</span>
                    <span className="font-semibold text-midnight-900">{s.value}%</span>
                  </div>
                  <Bar value={s.value} max={100} color={s.color} />
                </div>
              ))}
            </div>
          </Card>

          <Card title={t('admin.analytics.channelSummary')}>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: 'user', label: t('admin.dashboard.customers'), value: users.length },
                { icon: 'tag', label: t('admin.nav.coupons'), value: coupons.length },
                { icon: 'cart', label: t('admin.dashboard.orders'), value: orders.length }
              ].map((c) => (
                <div key={c.label} className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xl font-bold text-midnight-900">{c.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
