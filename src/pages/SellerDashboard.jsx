import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { PageHero, Breadcrumb } from '../components/Layout.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { api } from '../api/client.js'
import { formatDate } from '../utils/helpers.js'
import Icon from '../components/Icons.jsx'

const tabs = [
  { key: 'overview', label: 'overview', icon: 'home' },
  { key: 'products', label: 'products', icon: 'box' },
  { key: 'orders', label: 'orders', icon: 'cart' },
  { key: 'analytics', label: 'analytics', icon: 'chart' }
]

const input = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400'

export default function SellerDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { formatPrice, user, categories, toast } = useStore()
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: 'electronics',
    price: '',
    stock: '10',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    description: ''
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      if (!user) {
        navigate('/login')
        return
      }
      const res = await api.sellerMe()
      setData(res)
    } catch (err) {
      setError(err.message || 'Unable to load seller dashboard')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [user])

  const createProduct = async (e) => {
    e.preventDefault()
    try {
      await api.createSellerProduct({
        name: productForm.name,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.image,
        description: productForm.description
      })
      toast('Product created')
      setProductForm((f) => ({ ...f, name: '', price: '', description: '' }))
      await load()
      setTab('products')
    } catch (err) {
      toast(err.message || 'Failed to create product', 'error')
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">Loading seller dashboard...</div>
  }

  if (error || !data) {
    return (
      <div>
        <PageHero title={t('seller.dashboard')} crumb={t('nav.sell')}  theme="sell" />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600 mb-6">{error || 'No seller profile found.'}</p>
          <Link to="/sell#apply" className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold">
            {t('sell.cta')}
          </Link>
        </div>
      </div>
    )
  }

  const { seller, products: myProducts, stats, recentOrders } = data
  const pending = seller.status !== 'approved'

  const weekData = [42, 58, 39, 71, 55, 89, 62]
  const max = Math.max(...weekData)

  const cards = [
    { icon: 'zap', label: t('seller.today'), value: formatPrice(stats.todayRevenue), color: 'from-amber-500 to-orange-600' },
    { icon: 'creditCard', label: t('seller.totalRevenue'), value: formatPrice(stats.revenue), color: 'from-emerald-500 to-teal-600' },
    { icon: 'box', label: t('seller.pendingOrders'), value: stats.pendingOrders, color: 'from-brand-500 to-indigo-600' },
    { icon: 'tag', label: t('seller.productsActive'), value: stats.productsActive, color: 'from-rose-500 to-pink-600' }
  ]

  return (
    <div>
      <PageHero title={t('seller.dashboard')} crumb={t('nav.sell')}  theme="sell" />
      <Breadcrumb items={[{ label: t('seller.dashboard') }]} />

      {pending && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl px-5 py-4 text-sm">
            Your store <b>{seller.name}</b> is <b>{seller.status}</b>. You can browse the dashboard, but listing products requires admin approval.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4 mb-4">
            <div className="flex items-center gap-3 p-2">
              <img src={seller.image} alt={seller.name} className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-midnight-900 truncate">{seller.name}</p>
                <p className="text-xs text-slate-400 capitalize">{seller.status}</p>
              </div>
            </div>
          </div>
          <nav className="bg-white rounded-2xl border border-slate-100 shadow-soft p-3 space-y-1">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === tb.key ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-600'}`}
              >
                <Icon name={tb.icon} size={18} />
                {t(`seller.${tb.label}`)}
              </button>
            ))}
            <Link to={`/store/${seller.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors">
              <Icon name="store" size={18} />
              {t('seller.storefront')}
            </Link>
          </nav>
        </aside>

        <div className="flex-1 min-w-0 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white mb-3`}>
                      <Icon name={s.icon} size={20} />
                    </span>
                    <p className="text-xl font-bold text-midnight-900">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-7">
                <h3 className="font-bold text-midnight-900 mb-6">{t('seller.salesTrend')}</h3>
                <div className="flex items-end gap-3 h-40">
                  {weekData.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(v / max) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06 }}
                        className={`w-full rounded-t-xl ${i % 2 ? 'bg-gradient-to-t from-brand-600 to-indigo-400' : 'bg-gradient-to-t from-indigo-700 to-brand-500'}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-midnight-900">{t('seller.recentOrders')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="text-left px-6 py-3">{t('orders.orderId')}</th>
                        <th className="text-left px-6 py-3">{t('seller.customer')}</th>
                        <th className="text-left px-6 py-3">{t('seller.date')}</th>
                        <th className="text-left px-6 py-3">{t('seller.total')}</th>
                        <th className="text-left px-6 py-3">{t('seller.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-sm text-slate-400 text-center">No orders yet</td></tr>
                      ) : recentOrders.map((o) => (
                        <tr key={o.id} className="border-t border-slate-50">
                          <td className="px-6 py-4 text-sm font-semibold text-midnight-900">{o.id.slice(0, 10)}…</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{o.customer}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{formatDate(o.date)}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-midnight-900">{formatPrice(o.total)}</td>
                          <td className="px-6 py-4 text-sm capitalize">{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'products' && (
            <div className="space-y-6">
              {!pending && (
                <form onSubmit={createProduct} className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 grid md:grid-cols-2 gap-4">
                  <h3 className="md:col-span-2 font-bold text-midnight-900">Add product</h3>
                  <input required placeholder="Product name" className={input} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                  <select className={input} value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                  <input required type="number" step="0.01" placeholder="Price" className={input} value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                  <input required type="number" placeholder="Stock" className={input} value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                  <input required placeholder="Image URL" className={`md:col-span-2 ${input}`} value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                  <textarea placeholder="Description" className={`md:col-span-2 ${input}`} rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                  <button type="submit" className="md:col-span-2 py-3 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold">Create product</button>
                </form>
              )}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-400">
                      <th className="text-left px-6 py-3">Product</th>
                      <th className="text-left px-6 py-3">Price</th>
                      <th className="text-left px-6 py-3">Stock</th>
                      <th className="text-left px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProducts.map((p) => (
                      <tr key={p.id} className="border-t border-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-midnight-900 flex items-center gap-3">
                          <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          {p.name}
                        </td>
                        <td className="px-6 py-4 text-sm">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4 text-sm">{p.stock}</td>
                        <td className="px-6 py-4 text-sm">{p.active ? 'Active' : 'Hidden'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-400">
                    <th className="text-left px-6 py-3">Order</th>
                    <th className="text-left px-6 py-3">Customer</th>
                    <th className="text-left px-6 py-3">Total</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold">{o.id}</td>
                      <td className="px-6 py-4 text-sm">{o.customer}</td>
                      <td className="px-6 py-4 text-sm">{formatPrice(o.total)}</td>
                      <td className="px-6 py-4 text-sm capitalize">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'analytics' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
              <h3 className="font-bold text-midnight-900 mb-2">Earnings</h3>
              <p className="text-3xl font-bold text-midnight-900 mb-2">{formatPrice(seller.earnings)}</p>
              <p className="text-sm text-slate-500">Commission rate: {seller.commissionRate}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
