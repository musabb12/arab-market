import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Select, Table, Badge, SearchInput, Empty, Button } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import StarRating from '../../components/StarRating.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function Reviews() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { reviews, products } = siteData
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')

  const approved = reviews.filter((r) => r.status === 'approved').length
  const pending = reviews.filter((r) => r.status === 'pending').length

  const list = reviews.filter((r) => {
    if (status !== 'all' && r.status !== status) return false
    if (q && !r.comment.toLowerCase().includes(q.toLowerCase()) && !r.author.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const statusLabel = (s) => {
    if (['approved', 'pending'].includes(s)) return t(`admin.common.${s}`)
    return t(`admin.status.${s}`, { defaultValue: s })
  }

  const setReviewStatus = (id, s) => {
    updateSite((prev) => ({ ...prev, reviews: prev.reviews.map((r) => (r.id === id ? { ...r, status: s } : r)) }))
    toast(statusLabel(s))
  }

  const remove = (id) => {
    updateSite((prev) => ({ ...prev, reviews: prev.reviews.filter((r) => r.id !== id) }))
    toast(t('admin.common.delete'), 'info')
  }

  const productName = (id) => products.find((p) => p.id === id)?.name || id

  return (
    <div>
      <SectionTitle title={t('admin.reviews.title')} subtitle={t('admin.reviews.subtitle', { approved, pending })} />

      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2"><SearchInput value={q} onChange={setQ} placeholder={t('admin.reviews.search')} /></div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[
            { value: 'all', label: t('admin.common.all') },
            { value: 'approved', label: t('admin.common.approved') },
            { value: 'pending', label: t('admin.common.pending') }
          ]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="star" title={t('admin.reviews.empty')} /> : (
          <Table head={[t('admin.reviews.product'), t('admin.reviews.author'), t('admin.reviews.rating'), t('admin.reviews.comment'), t('admin.common.date'), t('admin.common.status'), t('admin.common.actions')]}>
            {list.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 align-top">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={products.find((p) => p.id === r.productId)?.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="text-sm font-semibold text-midnight-900 max-w-[160px] truncate">{productName(r.productId)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.author}</td>
                <td className="px-4 py-3"><StarRating rating={r.rating} size={13} /></td>
                <td className="px-4 py-3 text-slate-600 text-sm max-w-[280px]">{r.comment}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(r.date)}</td>
                <td className="px-4 py-3"><Badge tone={r.status === 'approved' ? 'green' : r.status === 'pending' ? 'amber' : 'red'}>{statusLabel(r.status)}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {r.status !== 'approved' && (
                      <Button size="sm" variant="success" onClick={() => setReviewStatus(r.id, 'approved')}>{t('admin.common.approve')}</Button>
                    )}
                    {r.status === 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => setReviewStatus(r.id, 'pending')}>{t('admin.common.unapprove')}</Button>
                    )}
                    <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}
