import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Badge, Button, Modal, Field, TextInput, SearchInput, Bar, Empty, AdminCardGrid, AdminEntityCard, AdminIconButton } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Sellers() {
  const { t } = useTranslation()
  const { siteData, updateSite, products, toast, refreshCatalog, formatPrice } = useStore()
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
        toast(t('admin.common.saved'))
      } else {
        toast(t('admin.common.add'), 'info')
      }
      setOpen(false)
      await refreshCatalog()
    } catch (err) {
      toast(err.message || t('admin.common.save'), 'error')
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
      toast(t(`admin.common.${status}`, { defaultValue: status }))
      await refreshCatalog()
    } catch (err) {
      toast(err.message || t('admin.common.save'), 'error')
    }
  }

  const countFor = (id) => products.filter((p) => p.sellerId === id).length

  return (
    <div>
      <SectionTitle
        title={t('admin.sellers.title')}
        subtitle={t('admin.sellers.subtitle', { count: sellers.length })}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> {t('admin.sellers.add')}</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder={t('admin.sellers.search')} /></Card>

      {list.length === 0 ? (
        <Card>
          <Empty icon="store" title={t('admin.sellers.empty')} />
        </Card>
      ) : (
        <AdminCardGrid className="sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <AdminEntityCard
              key={s.id}
              image={s.image}
              imageAlt={s.name}
              gradient="bg-brand-600"
              title={s.name}
              subtitle={`${s.followers?.toLocaleString?.() || s.followers} · ${s.response}`}
              topBadges={[
                {
                  label: t(`admin.common.${s.status}`, { defaultValue: s.status }),
                  tone: s.status === 'approved' ? 'green' : s.status === 'pending' ? 'amber' : 'red'
                }
              ]}
              meta={[
                { label: t('admin.sellers.products'), value: countFor(s.id) },
                { label: t('admin.reviews.rating'), value: `${s.rating?.toFixed?.(1) || s.rating} ★` },
                { label: t('admin.sellers.commission'), value: `${s.commissionRate}%` },
                { label: t('admin.sellers.earnings'), value: formatPrice ? formatPrice(s.earnings || 0) : `$${(s.earnings || 0).toLocaleString()}` }
              ]}
              footer={
                <>
                  <div className="flex-1 min-w-0 pe-2">
                    <Bar value={s.earnings || 0} max={maxEarnings} />
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <AdminIconButton icon="edit" title={t('admin.common.edit')} onClick={() => openEdit(s)} />
                    {s.status !== 'approved' ? (
                      <button type="button" onClick={() => setStatus(s, 'approved')} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                        {t('admin.common.approve')}
                      </button>
                    ) : (
                      <button type="button" onClick={() => setStatus(s, 'suspended')} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                        {t('admin.common.suspend')}
                      </button>
                    )}
                  </div>
                </>
              }
            />
          ))}
        </AdminCardGrid>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.sellers.edit') : t('admin.sellers.add')}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('admin.sellers.storeName')}><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label={t('admin.common.imageUrl')}><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></Field>
            <Field label={t('admin.reviews.rating')}><TextInput type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
            <Field label={t('admin.sellers.commission')}><TextInput type="number" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} /></Field>
            <Field label={t('admin.common.status')}>
              <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="approved">{t('admin.common.approved')}</option>
                <option value="pending">{t('admin.common.pending')}</option>
                <option value="suspended">{t('admin.common.suspended')}</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">{editing ? t('admin.common.save') : t('admin.common.create')}</Button></div>
        </form>
      </Modal>
    </div>
  )
}
