import React from 'react'
import { Link } from 'react-router-dom'
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
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeks = pts.filter((_, i) => i % 2 === 0)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f6eee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3f6eee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#f1f5f9" strokeWidth="1" />
        ))}
      </g>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke="#3f6eee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#3f6eee" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const { orders, products, users, settings, content, adminSession } = useStore()

  const revenue = orders.reduce((s, o) => s + o.total, 0) + 128450
  const orderCount = orders.length + 486
  const pendingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'pending').length + 12
  const activeProducts = products.length
  const lowStock = products.filter((p) => p.stock < settings.lowStockThreshold)

  const stats = [
    { icon: 'creditCard', label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, delta: 18.2, color: 'from-emerald-500 to-teal-600' },
    { icon: 'cart', label: 'Total Orders', value: orderCount.toLocaleString(), delta: 9.4, color: 'from-brand-500 to-indigo-600' },
    { icon: 'user', label: 'Customers', value: users.length.toLocaleString(), delta: 12.6, color: 'from-purple-500 to-pink-500' },
    { icon: 'box', label: 'Products Live', value: activeProducts, delta: 4.1, color: 'from-amber-500 to-orange-600' }
  ]

  const salesData = [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 39 },
    { label: 'Thu', value: 71 }, { label: 'Fri', value: 55 }, { label: 'Sat', value: 89 }, { label: 'Sun', value: 62 }
  ]
  const maxSales = Math.max(...salesData.map((s) => s.value))

  return (
    <div>
      <SectionTitle
        title={`Welcome back, ${adminSession?.name || 'Admin'}`}
        subtitle={`${settings?.siteName || 'ARAB'} Market is running smoothly. Here is what happened today.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card title="Revenue Overview" subtitle="Weekly revenue trend" className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            {['7 days', '30 days', '90 days'].map((r) => (
              <button key={r} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${r === '7 days' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{r}</button>
            ))}
          </div>
          <AreaChart />
        </Card>

        <Card title="Sales by Day" subtitle="Orders per weekday">
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
          title="Recent Orders"
          actions={<Link to="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">View all</Link>}
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
                <span className="text-sm font-bold text-midnight-900">${o.total?.toFixed?.(2) || '0.00'}</span>
                <StatusBadge o={o} />
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">No orders placed yet.</p>
            )}
          </div>
        </Card>

        <Card
          title="Low Stock Alerts"
          subtitle={`Products below the ${settings.lowStockThreshold} unit threshold`}
          actions={<Link to="/admin/products" className="text-xs font-semibold text-brand-600 hover:underline">Manage</Link>}
        >
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">All products are sufficiently stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-midnight-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <Badge tone={p.stock <= 0 ? 'red' : 'amber'}>{p.stock} left</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ o }) {
  const map = { confirmed: 'green', processing: 'amber', shipped: 'blue', delivered: 'green', cancelled: 'red' }
  return <Badge tone={map[o.status] || 'gray'}>{o.status}</Badge>
}
