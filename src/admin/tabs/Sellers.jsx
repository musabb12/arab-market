import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Table, Badge, Button, Modal, Field, TextInput, SearchInput, StatusBadge, Bar, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Sellers() {
  const { siteData, updateSite, products, toast, refreshCatalog } = useStore()
  const { sellers } = siteData
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', image: '', rating: 4.8, followers: 100, response: '1h', commissionRate: 8, status: 'approved', earnings: 0 })

  const list = sellers.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
  const maxEarnings = Math.max(...sellers.map((s) => s.earnings || 0), 1)

  const openEdit = (s) => { setEditing(s); setForm(s); setOpen(true) }
  const openNew = () => { setEditing(null); setForm({ name: '', image: '', rating: 4.8, followers: 100, response: '1h', commissionRate: 8, status: 'approved', earnings: 0 }); setOpen(true) }

  const save = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const { api } = await import('../../api/client.js')
        const { seller } = await api.adminUpdateSeller(editing.id, form)
        updateSite((prev) => ({ ...prev, sellers: prev.sellers.map((s) => (s.id === editing.id ? { ...s, ...seller } : s)) }))
        toast('Seller updated')
      } else {
        toast('Create sellers via storefront applications (/sell)', 'info')
      }
      setOpen(false)
      await refreshCatalog()
    } catch (err) {
      toast(err.message || 'Update failed', 'error')
    }
  }

  const setStatus = async (s, status) => {
    try {
      const { api } = await import('../../api/client.js')
      const { seller } = await api.adminUpdateSeller(s.id, { status })
      updateSite((prev) => ({
        ...prev,
        sellers: prev.sellers.map((x) => (x.id === s.id ? { ...x, ...seller, approved: status === 'approved' } : x))
      }))
      toast(`${s.name} ${status}`)
      await refreshCatalog()
    } catch (err) {
      toast(err.message || 'Status update failed', 'error')
    }
  }

  const countFor = (id) => products.filter((p) => p.sellerId === id).length

  return (
    <div>
      <SectionTitle
        title="Sellers"
        subtitle={`${sellers.length} seller stores`}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> Add seller</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder="Search sellers..." /></Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="store" title="No sellers found" /> : (
          <Table head={['Seller', 'Products', 'Rating', 'Commission', 'Earnings', 'Status', 'Actions']}>
            {list.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-semibold text-midnight-900">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.followers.toLocaleString()} followers · {s.response}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge tone="blue">{countFor(s.id)}</Badge></td>
                <td className="px-4 py-3 text-slate-600">{s.rating.toFixed(1)} ★</td>
                <td className="px-4 py-3 text-slate-600">{s.commissionRate}%</td>
                <td className="px-4 py-3 w-44">
                  <div className="text-sm font-semibold text-midnight-900 mb-1">${s.earnings.toLocaleString()}</div>
                  <Bar value={s.earnings} max={maxEarnings} />
                </td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="edit" size={16} /></button>
                    {s.status !== 'approved' && (
                      <button onClick={() => setStatus(s, 'approved')} className="text-xs font-semibold px-2 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50">Approve</button>
                    )}
                    {s.status === 'approved' && (
                      <button onClick={() => setStatus(s, 'suspended')} className="text-xs font-semibold px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50">Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit seller' : 'Add seller'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Store name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Image URL"><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field>
            <Field label="Rating (0-5)"><TextInput type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
            <Field label="Followers"><TextInput type="number" value={form.followers} onChange={(e) => setForm({ ...form, followers: Number(e.target.value) })} /></Field>
            <Field label="Commission rate (%)"><TextInput type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} /></Field>
            <Field label="Status">
              <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">{editing ? 'Save changes' : 'Create seller'}</Button></div>
        </form>
      </Modal>
    </div>
  )
}
