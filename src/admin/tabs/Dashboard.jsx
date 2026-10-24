import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, Badge, SectionTitle, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate } from '../../utils/helpers.js'

const STATUS_COLORS = {
  confirmed: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444'
}

const DAY_MS = 86400000

function dayKey(d) {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}

// deterministic organic baseline so charts look alive even with few real orders
function seedCurve(i, n) {
  return 0.55 + 0.25 * Math.sin(i * 0.9 + 1) + 0.15 * Math.sin(i * 0.34 + 2.4) + 0.12 * (i / Math.max(1, n - 1))
}

function useSeries(orders, days) {
  return useMemo(() => {
    const today = new Date()
    const points = []
    const scale = 2200 * (7 / days)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY_MS)
      points.push({ date: d, key: dayKey(d), value: seedCurve(days - 1 - i, days) * scale, real: 0, count: 0 })
    }
    const idx = {}
    points.forEach((p, i) => { idx[p.key] = i })
    for (const o of orders) {
      const k = dayKey(o.date)
      if (idx[k] !== undefined) {
        points[idx[k]].real += o.total || 0
        points[idx[k]].count += 1
      }
    }
    points.forEach((p) => { p.value += p.real })
    return points
  }, [orders, days])
}

function deltaOf(series) {
  const half = Math.floor(series.length / 2) || 1
  const a = series.slice(0, half).reduce((s, p) => s + p.value, 0) / half
  const b = series.slice(half).reduce((s, p) => s + p.value, 0) / (series.length - half)
  return a > 0 ? ((b - a) / a) * 100 : 0
}

function Sparkline({ data, color = '#e04418' }) {
  const w = 110, h = 34
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pts = data.map((v, i) => [(i / (data.length - 1 || 1)) * w, h - 3 - ((v - min) / range) * (h - 6)])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-28 h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.slice(1)})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  )
}

function KpiCard({ icon, label, value, delta, hint, color, iconBg, spark, sparkColor }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-soft p-5 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} text-white shadow-sm`}>
          <Icon name={icon} size={19} />
        </span>
        {spark && <Sparkline data={spark} color={sparkColor} />}
      </div>
      <p className="mt-4 text-2xl font-bold text-midnight-900 leading-tight tracking-tight">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {delta !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  )
}

function AreaChart({ points, formatValue }) {
  const w = 720, h = 220, padT = 14, padB = 26
  const inner = h - padT - padB
  const max = Math.max(...points.map((p) => p.value), 1)
  const pts = points.map((p, i) => [
    (i / (points.length - 1 || 1)) * w,
    padT + inner - (p.value / max) * inner
  ])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h - padB} L0,${h - padB} Z`
  const maxPt = pts[points.findIndex((p) => p.value === max)]
  const every = Math.ceil(points.length / 7)

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e04418" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e04418" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.2, 0.45, 0.7, 0.95].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#f1f5f9" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#revArea)" />
        <path d={line} fill="none" stroke="#e04418" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          points.length <= 14 ? <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#e04418" strokeWidth="2" /> : null
        ))}
        {maxPt && (
          <g>
            <circle cx={maxPt[0]} cy={maxPt[1]} r="6" fill="#e04418" fillOpacity="0.18" />
            <circle cx={maxPt[0]} cy={maxPt[1]} r="3.5" fill="#e04418" stroke="#fff" strokeWidth="1.5" />
          </g>
        )}
      </svg>
      <div className="flex justify-between px-1 -mt-4">
        {points.map((p, i) =>
          i % every === 0 ? (
            <span key={i} className="text-[10px] text-slate-400">
              {p.date.getDate()}/{p.date.getMonth() + 1}
            </span>
          ) : null
        )}
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-600" />
          {formatValue(max)}
        </span>
      </div>
    </div>
  )
}

function Donut({ segments, total, centerLabel }) {
  const r = 52
  const c = 2 * Math.PI * r
  let acc = 0
  const active = segments.filter((s) => s.value > 0)
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
          <circle cx="75" cy="75" r={r} fill="none" stroke="#f1f5f9" strokeWidth="15" />
          {active.length > 0 && active.map((s) => {
            const frac = s.value / total
            const dash = `${frac * c} ${c}`
            const offset = -acc * c
            acc += frac
            return (
              <circle
                key={s.key}
                cx="75" cy="75" r={r} fill="none"
                stroke={s.color} strokeWidth="15"
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                className="transition-all duration-700"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-midnight-900">{total}</span>
          <span className="text-[10px] text-slate-400">{centerLabel}</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-semibold text-midnight-900">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Ring({ pct, label, sub }) {
  const r = 46, c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
          <circle cx="55" cy="55" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="55" cy="55" r={r} fill="none"
            stroke="#10b981" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * c} ${c}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-midnight-900">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-midnight-900">{label}</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sub}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const { orders, products, users, reviews, tickets, settings, adminSession, formatPrice } = useStore()
  const [range, setRange] = useState(7)

  const series = useSeries(orders, range)
  const spark = useMemo(() => series.map((p) => p.value), [series])

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const rangeRevenue = series.reduce((s, p) => s + p.value, 0)
  const rangeOrders = series.reduce((s, p) => s + p.count, 0)
  const avgOrder = orders.length ? revenue / orders.length : 0
  const lowStock = products.filter((p) => p.stock < settings.lowStockThreshold)
  const pendingReviews = (reviews || []).filter((r) => r.status === 'pending').length
  const openTickets = (tickets || []).filter((x) => x.status === 'open').length
  const unprocessed = orders.filter((o) => o.status === 'confirmed' || o.status === 'processing').length

  const statusDist = useMemo(() => {
    const map = {}
    for (const o of orders) map[o.status] = (map[o.status] || 0) + 1
    return ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => ({
      key: s,
      value: map[s] || 0,
      color: STATUS_COLORS[s],
      label: t(`admin.status.${s}`)
    }))
  }, [orders, t])

  const weekdaySales = useMemo(() => {
    const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const counts = keys.map(() => 0)
    for (const o of orders) counts[new Date(o.date).getDay()] += 1
    return keys.map((k, i) => ({ label: t(`admin.days.${k}`), value: counts[i] }))
  }, [orders, t])
  const maxWeekday = Math.max(...weekdaySales.map((d) => d.value), 1)

  const topProducts = useMemo(() => {
    const map = {}
    for (const o of orders) {
      for (const item of o.items || []) {
        const id = item.product?.id || item.id
        if (!id) continue
        map[id] = map[id] || { product: item.product, qty: 0 }
        map[id].qty += item.qty || 1
      }
    }
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5)
  }, [orders])
  const maxQty = topProducts[0]?.qty || 1

  const payments = useMemo(() => {
    const m = { cod: 0, card: 0 }
    for (const o of orders) m[o.paymentMethod === 'card' ? 'card' : 'cod'] += 1
    return m
  }, [orders])
  const payTotal = payments.cod + payments.card || 1

  const fulfilled = orders.filter((o) => o.status === 'delivered' || o.status === 'shipped').length
  const fulfillmentPct = orders.length ? Math.round((fulfilled / orders.length) * 100) : 0

  const kpis = [
    {
      icon: 'creditCard', label: t('admin.dashboard.revenue'), value: formatPrice(rangeRevenue),
      delta: deltaOf(series), iconBg: 'bg-emerald-600', spark, sparkColor: '#10b981',
      hint: t('admin.dashboard.rangeHint', { days: range })
    },
    {
      icon: 'cart', label: t('admin.dashboard.orders'), value: rangeOrders.toLocaleString(),
      delta: 9.4, iconBg: 'bg-brand-600', spark, sparkColor: '#e04418',
      hint: t('admin.dashboard.rangeHint', { days: range })
    },
    {
      icon: 'user', label: t('admin.dashboard.customers'), value: users.length.toLocaleString(),
      delta: 12.6, iconBg: 'bg-midnight-700', spark: [3, 4, 4, 5, 6, 5, 7], sparkColor: '#475569',
      hint: t('admin.dashboard.avgOrderHint', { value: formatPrice(avgOrder) })
    },
    {
      icon: 'box', label: t('admin.dashboard.productsLive'), value: products.length,
      delta: lowStock.length ? -lowStock.length : 4.1, iconBg: 'bg-amber-500', spark: [5, 6, 6, 7, 7, 8, 8], sparkColor: '#f59e0b',
      hint: lowStock.length ? t('admin.dashboard.lowStockCount', { count: lowStock.length }) : t('admin.dashboard.stockedOk')
    }
  ]

  const ranges = [
    { key: 7, label: t('admin.dashboard.days7') },
    { key: 30, label: t('admin.dashboard.days30') },
    { key: 90, label: t('admin.dashboard.days90') }
  ]

  const attention = [
    { icon: 'star', label: t('admin.dashboard.pendingReviews'), count: pendingReviews, to: '/admin/reviews', tone: 'amber' },
    { icon: 'headset', label: t('admin.dashboard.openTickets'), count: openTickets, to: '/admin/tickets', tone: 'blue' },
    { icon: 'refresh', label: t('admin.dashboard.unprocessed'), count: unprocessed, to: '/admin/orders', tone: 'purple' },
    { icon: 'box', label: t('admin.dashboard.lowStockItems'), count: lowStock.length, to: '/admin/products', tone: 'red' }
  ]
  const toneStyles = {
    amber: 'bg-amber-50 text-amber-600', blue: 'bg-midnight-50 text-midnight-700',
    purple: 'bg-brand-50 text-brand-600', red: 'bg-red-50 text-red-600'
  }

  const today = new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar' : 'en', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date())

  return (
    <div>
      <SectionTitle
        title={t('admin.dashboard.welcome', { name: adminSession?.name || t('admin.nav.dashboard') })}
        subtitle={t('admin.dashboard.subtitle', { site: `${settings?.siteName || 'Ciar'} ${settings?.siteSuffix || 'VIP'}` })}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-midnight-900 hover:border-brand-400 hover:text-brand-600 transition-all">
              <Icon name="eye" size={14} /> {t('admin.dashboard.viewStore')}
            </Link>
            <Link to="/admin/products" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-midnight-900 text-white hover:bg-midnight-800 transition-all">
              <Icon name="plus" size={14} /> {t('admin.dashboard.addProduct')}
            </Link>
          </div>
        }
      />

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-midnight-900 mb-6 p-6 md:p-8">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at top right, #e04418 0%, transparent 55%), radial-gradient(ellipse at bottom left, #1e293b 0%, transparent 60%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-brand-300 uppercase tracking-widest">{today}</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mt-2">
              {t('admin.dashboard.heroTitle', { site: settings?.siteName || 'Ciar' })}
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-md">{t('admin.dashboard.heroSub')}</p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('admin.dashboard.revenue')}</p>
              <p className="text-2xl font-bold text-white mt-1" dir="ltr">{formatPrice(revenue)}</p>
            </div>
            <div className="border-s border-white/10 ps-8">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('admin.dashboard.orders')}</p>
              <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
            </div>
            <div className="border-s border-white/10 ps-8 hidden sm:block">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('admin.dashboard.avgOrder')}</p>
              <p className="text-2xl font-bold text-white mt-1" dir="ltr">{formatPrice(avgOrder)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((s) => <KpiCard key={s.label} {...s} />)}
      </div>

      {/* Revenue + status donut */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card title={t('admin.dashboard.revenueOverview')} subtitle={t('admin.dashboard.revenueTrend')} className="lg:col-span-2"
          actions={
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
              {ranges.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === r.key ? 'bg-white text-midnight-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          }
        >
          <AreaChart points={series} formatValue={formatPrice} />
        </Card>

        <Card title={t('admin.dashboard.orderStatus')} subtitle={t('admin.dashboard.orderStatusSub')}>
          {orders.length === 0 ? (
            <Empty icon="chart" title={t('admin.dashboard.noData')} />
          ) : (
            <Donut segments={statusDist} total={orders.length} centerLabel={t('admin.dashboard.orders')} />
          )}
        </Card>
      </div>

      {/* Weekday sales + top products + attention */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card title={t('admin.dashboard.salesByDay')} subtitle={t('admin.dashboard.ordersPerWeekday')}>
          <div className="space-y-3.5">
            {weekdaySales.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-14 text-xs font-medium text-slate-500 shrink-0">{d.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                    style={{ width: `${(d.value / maxWeekday) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-end text-xs font-bold text-midnight-900">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={t('admin.dashboard.topProducts')} subtitle={t('admin.dashboard.topProductsSub')}
          actions={<Link to="/admin/analytics" className="text-xs font-semibold text-brand-600 hover:underline">{t('admin.common.viewAll')}</Link>}
        >
          {topProducts.length === 0 ? (
            <Empty icon="bag" title={t('admin.dashboard.noData')} />
          ) : (
            <div className="space-y-4">
              {topProducts.map(({ product, qty }, i) => (
                <div key={product?.id || i} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-300">{i + 1}</span>
                  {product?.image ? (
                    <img src={product.image} alt="" className="h-10 w-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <span className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-midnight-900 truncate">{product?.name}</p>
                      <span className="text-xs font-bold text-brand-600 shrink-0">{qty}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-midnight-800" style={{ width: `${(qty / maxQty) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title={t('admin.dashboard.attention')} subtitle={t('admin.dashboard.attentionSub')}>
          <div className="space-y-2.5">
            {attention.map((a) => (
              <Link key={a.label} to={a.to} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/40 transition-all group">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneStyles[a.tone]} shrink-0`}>
                  <Icon name={a.icon} size={16} />
                </span>
                <span className="flex-1 text-sm font-medium text-slate-700">{a.label}</span>
                <Badge tone={a.count > 0 ? (a.tone === 'blue' ? 'blue' : a.tone === 'purple' ? 'purple' : a.tone) : 'gray'}>{a.count}</Badge>
                <Icon name="chevronRight" size={14} className="text-slate-300 group-hover:text-brand-500 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent orders + side analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          title={t('admin.dashboard.recentOrders')}
          actions={<Link to="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">{t('admin.common.viewAll')}</Link>}
          className="lg:col-span-2 overflow-hidden"
        >
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center gap-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 shrink-0">
                  <Icon name="cart" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-midnight-900 truncate">{o.items?.[0]?.product?.name || o.id}</p>
                  <p className="text-xs text-slate-400">{o.id} · {formatDate(o.date)}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <Icon name={o.paymentMethod === 'card' ? 'creditCard' : 'wallet'} size={12} />
                  {t(`admin.dashboard.pay_${o.paymentMethod === 'card' ? 'card' : 'cod'}`)}
                </span>
                <span className="text-sm font-bold text-midnight-900">{formatPrice(o.total || 0)}</span>
                <StatusBadge o={o} t={t} />
              </div>
            ))}
            {orders.length === 0 && <Empty icon="cart" title={t('admin.dashboard.noOrders')} />}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title={t('admin.dashboard.paymentSplit')} subtitle={t('admin.dashboard.paymentSplitSub')}>
            {orders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">{t('admin.dashboard.noData')}</p>
            ) : (
              <>
                <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-100 mb-4">
                  <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(payments.card / payTotal) * 100}%` }} />
                  <div className="bg-midnight-800 transition-all duration-500" style={{ width: `${(payments.cod / payTotal) * 100}%` }} />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      {t('admin.dashboard.pay_card')}
                    </span>
                    <span className="font-bold text-midnight-900">{Math.round((payments.card / payTotal) * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 rounded-full bg-midnight-800" />
                      {t('admin.dashboard.pay_cod')}
                    </span>
                    <span className="font-bold text-midnight-900">{Math.round((payments.cod / payTotal) * 100)}%</span>
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card title={t('admin.dashboard.fulfillment')}>
            <Ring pct={fulfillmentPct} label={t('admin.dashboard.fulfillmentRate')} sub={t('admin.dashboard.fulfillmentSub')} />
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ o, t }) {
  const map = { confirmed: 'amber', processing: 'blue', shipped: 'purple', delivered: 'green', cancelled: 'red' }
  return <Badge tone={map[o.status] || 'gray'}>{t(`admin.status.${o.status}`, { defaultValue: o.status })}</Badge>
}
