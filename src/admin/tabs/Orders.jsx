import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Badge, Select, SearchInput, Table, Empty, Modal, Button } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate, getBrand } from '../../utils/helpers.js'

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const { t } = useTranslation()
  const { orders, updateOrder, toast } = useStore()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [viewing, setViewing] = useState(null)

  const statusOptions = STATUSES.map((s) => ({ value: s, label: t(`admin.status.${s}`) }))

  const list = useMemo(() => {
    let l = [...orders]
    if (status !== 'all') l = l.filter((o) => o.status === status)
    if (q) l = l.filter((o) => o.id.toLowerCase().includes(q.toLowerCase()) || o.email?.toLowerCase().includes(q.toLowerCase()))
    return l
  }, [orders, q, status])

  const setStatusOf = (id, s) => {
    updateOrder(id, { status: s })
    toast(t(`admin.status.${s}`))
  }

  return (
    <div>
      <SectionTitle title={t('admin.orders.title')} subtitle={t('admin.orders.subtitle', { count: list.length })} />

      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <SearchInput value={q} onChange={setQ} placeholder={t('admin.orders.search')} />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'all', label: t('admin.common.all') }, ...statusOptions]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <Empty icon="cart" title={t('admin.orders.empty')} subtitle={t('admin.orders.emptySub')} />
        ) : (
          <Table head={[t('admin.orders.title'), t('admin.common.customer'), t('admin.common.items'), t('admin.common.total'), t('admin.common.status'), t('admin.common.date'), t('admin.common.actions')]}>
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-brand-600">{o.id}</td>
                <td className="px-4 py-3 text-slate-600">{o.email || t('admin.common.customer')}</td>
                <td className="px-4 py-3 text-slate-600">{o.items?.reduce((s, i) => s + i.qty, 0) || 0}</td>
                <td className="px-4 py-3 font-semibold text-midnight-900">${o.total?.toFixed?.(2) || '0.00'}</td>
                <td className="px-4 py-3">
                  <Select
                    value={o.status}
                    onChange={(e) => setStatusOf(o.id, e.target.value)}
                    options={statusOptions}
                    className="!py-1.5 !text-xs w-36"
                  />
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(o.date)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setViewing(o)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                    <Icon name="eye" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? t('admin.orders.order', { id: viewing.id }) : ''}>
        {viewing && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{t(`admin.status.${viewing.status}`)}</Badge>
              <span className="text-xs text-slate-400">{formatDate(viewing.date)}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('admin.common.customer')}</p>
              <p className="text-sm text-midnight-900">{viewing.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('admin.common.items')}</p>
              <div className="space-y-2">
                {viewing.items?.map((i) => (
                  <div key={i.id} className="flex items-center gap-3">
                    <img src={i.product?.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-midnight-900 truncate">{i.product?.name}</p>
                      <p className="text-xs text-slate-400">{getBrand(i.product?.brand).name} · {i.qty}</p>
                    </div>
                    <span className="text-sm font-semibold">${(i.product?.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="font-semibold text-midnight-900">{t('admin.orders.orderTotal')}</span>
              <span className="text-lg font-bold text-midnight-900">${viewing.total?.toFixed?.(2) || '0.00'}</span>
            </div>
            <div className="flex gap-2 justify-end">
              {STATUSES.filter((s) => s !== viewing.status).map((s) => (
                <Button key={s} size="sm" variant={s === 'cancelled' ? 'danger' : 'outline'} onClick={() => { setStatusOf(viewing.id, s); setViewing(null) }}>
                  {t(`admin.status.${s}`)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
