import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Select, Table, Badge, SearchInput, Empty, Button } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import StarRating from '../../components/StarRating.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function Reviews() {
  const { siteData, updateSite, toast } = useStore()
  const { reviews, products } = siteData
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')

  const list = reviews.filter((r) => {
    if (status !== 'all' && r.status !== status) return false
    if (q && !r.comment.toLowerCase().includes(q.toLowerCase()) && !r.author.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const setReviewStatus = (id, s) => {
    updateSite((prev) => ({ ...prev, reviews: prev.reviews.map((r) => (r.id === id ? { ...r, status: s } : r)) }))
    toast(`Review ${s}`)
  }

  const remove = (id) => {
    updateSite((prev) => ({ ...prev, reviews: prev.reviews.filter((r) => r.id !== id) }))
    toast('Review removed', 'info')
  }

  const productName = (id) => products.find((p) => p.id === id)?.name || id

  return (
    <div>
      <SectionTitle title="Reviews" subtitle={`${reviews.filter((r) => r.status === 'approved').length} approved · ${reviews.filter((r) => r.status === 'pending').length} pending`} />

      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2"><SearchInput value={q} onChange={setQ} placeholder="Search reviews..." /></div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'approved', label: 'Approved' }, { value: 'pending', label: 'Pending' }, { value: 'rejected', label: 'Rejected' }]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="star" title="No reviews found" /> : (
          <Table head={['Product', 'Author', 'Rating', 'Review', 'Date', 'Status', 'Actions']}>
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
                <td className="px-4 py-3"><Badge tone={r.status === 'approved' ? 'green' : r.status === 'pending' ? 'amber' : 'red'}>{r.status}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {r.status !== 'approved' && (
                      <Button size="sm" variant="success" onClick={() => setReviewStatus(r.id, 'approved')}>Approve</Button>
                    )}
                    {r.status === 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => setReviewStatus(r.id, 'pending')}>Unapprove</Button>
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
