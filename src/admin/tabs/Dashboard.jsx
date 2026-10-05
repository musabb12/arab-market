import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { Stat, Card, Badge, SectionTitle, Bar } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate } from '../../utils/helpers.js'

const AREA = [32, 44, 38, 55, 48, 62, 58, 70, 66, 78, 72, 88]

function AreaChart() {
  const w = 700
  const h = 200
  const max = Math.max(...AREA)
  const pts = AREA.map((v, i) => [ (i / (AREA.length - 1)) * w, h - (v / max) * (h - 20) - 10 ])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
      <g>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#f1f5f9" strokeWidth="1" />
        ))}
      </g>
      <path d={area} fill="#e04418" fillOpacity="0.12" />
      <path d={line} fill="none" stroke="#e04418" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#e04418" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { orders, products, users, settings, adminSession, formatPrice } = useStore()

  const revenue = orders.reduce((s, o) => s + o.total, 0) + 128450
  const orderCount = orders.length + 486
  const activeProducts = products.length
  const lowStock = products.filter((p) => p.stock < settings.lowStockThreshold)

  const stats = [
    { icon: 'creditCard', label: t('admin.dashboard.revenue'), value: formatPrice ? formatPrice(revenue) : `$${revenue.toLocaleString()}`, delta: 18.2, color: 'bg-emerald-600' },
    { icon: 'cart', label: t('admin.dashboard.orders'), value: orderCount.toLocaleString(), delta: 9.4, color: 'bg-brand-600' },
    { icon: 'user', label: t('admin.dashboard.customers'), value: users.length.toLocaleString(), delta: 12.6, color: 'bg-midnight-700' },
    { icon: 'box', label: t('admin.dashboard.productsLive'), value: activeProducts, delta: 4.1, color: 'bg-amber-500' }
  ]

  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const salesValues = [42, 58, 39, 71, 55, 89, 62]
  const salesData = dayKeys.map((key, i) => ({ label: t(`admin.days.${key}`), value: salesValues[i] }))
  const maxSales = Math.max(...salesData.map((s) => s.value))
  const ranges = [
    { key: '7', label: t('admin.dashboard.days7') },
    { key: '30', label: t('admin.dashboard.days30') },
    { key: '90', label: t('admin.dashboard.days90') }
  ]

  return (
    <div>
      <SectionTitle
        title={t('admin.dashboard.welcome', { name: adminSession?.name || t('admin.nav.dashboard') })}
        subtitle={t('admin.dashboard.subtitle', { site: `${settings?.siteName || 'Ciar'} ${settings?.siteSuffix || 'VIP'}` })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card title={t('admin.dashboard.revenueOverview')} subtitle={t('admin.dashboard.revenueTrend')} className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            {ranges.map((r) => (
              <button key={r.key} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${r.key === '7' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{r.label}</button>
            ))}
          </div>
          <AreaChart />
        </Card>

        <Card title={t('admin.dashboard.salesByDay')} subtitle={t('admin.dashboard.ordersPerWeekday')}>
          <div className="space-y-3">
            {salesData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-500">{d.label}</span>
                  <span className="font-semibold text-midnight-900">{d.value}</span>
                </div>
                <Bar value={d.value} max={maxSales} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card
          title={t('admin.dashboard.recentOrders')}
          actions={<Link to="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">{t('admin.common.viewAll')}</Link>}
          className="overflow-hidden"
        >
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Icon name="cart" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-midnight-900 truncate">{o.items?.[0]?.product?.name || o.id}</p>
                  <p className="text-xs text-slate-400">{o.id} · {formatDate(o.date)}</p>
                </div>
                <span className="text-sm font-bold text-midnight-900">{formatPrice ? formatPrice(o.total || 0) : `$${(o.total || 0).toFixed?.(2) || '0.00'}`}</span>
                <StatusBadge o={o} t={t} />
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">{t('admin.dashboard.noOrders')}</p>
            )}
          </div>
        </Card>

        <Card
          title={t('admin.dashboard.lowStock')}
          subtitle={t('admin.dashboard.lowStockSub', { threshold: settings.lowStockThreshold })}
          actions={<Link to="/admin/products" className="text-xs font-semibold text-brand-600 hover:underline">{t('admin.common.manage')}</Link>}
        >
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">{t('admin.dashboard.stockedOk')}</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-midnight-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <Badge tone={p.stock <= 0 ? 'red' : 'amber'}>{t('admin.common.left', { count: p.stock })}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ o, t }) {
  const map = { confirmed: 'green', processing: 'amber', shipped: 'blue', delivered: 'green', cancelled: 'red' }
  return <Badge tone={map[o.status] || 'gray'}>{t(`admin.status.${o.status}`, { defaultValue: o.status })}</Badge>
}
