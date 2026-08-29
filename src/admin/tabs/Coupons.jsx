import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Toggle, Table, SearchInput, StatusBadge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function Coupons() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { coupons } = siteData
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ code: '', discount: 10, minOrder: 50, expires: '', status: 'active', used: 0, limit: 100 })

  const list = coupons.filter((c) => c.code.toLowerCase().includes(q.toLowerCase()))

  const openEdit = (c) => { setEditing(c); setForm(c); setOpen(true) }
  const openNew = () => { setEditing(null); setForm({ code: '', discount: 10, minOrder: 50, expires: '', status: 'active', used: 0, limit: 100 }); setOpen(true) }

  const save = (e) => {
    e.preventDefault()
    const payload = { ...form, discount: Number(form.discount), minOrder: Number(form.minOrder), limit: Number(form.limit), code: form.code.toUpperCase() }
    if (editing) {
      updateSite((prev) => ({ ...prev, coupons: prev.coupons.map((c) => (c.id === editing.id ? { ...c, ...payload } : c)) }))
      toast(t('admin.common.saved'))
    } else {
      const id = `cp${Date.now().toString().slice(-5)}`
      updateSite((prev) => ({ ...prev, coupons: [{ id, ...payload }, ...prev.coupons] }))
      toast(t('admin.common.saved'))
    }
    setOpen(false)
  }

  const remove = (id) => {
    updateSite((prev) => ({ ...prev, coupons: prev.coupons.filter((c) => c.id !== id) }))
    toast(t('admin.common.delete'), 'info')
  }

  const toggleStatus = (c) => {
    const next = c.status === 'active' ? 'inactive' : 'active'
    updateSite((prev) => ({ ...prev, coupons: prev.coupons.map((x) => (x.id === c.id ? { ...x, status: next } : x)) }))
    toast(t(`admin.common.${next}`))
  }

  return (
    <div>
      <SectionTitle
        title={t('admin.coupons.title')}
        subtitle={t('admin.coupons.subtitle', { count: coupons.length })}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> {t('admin.coupons.add')}</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder={t('admin.coupons.search')} /></Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">{t('admin.coupons.empty')}</p>
        ) : (
          <Table head={[t('admin.common.code'), t('admin.common.value'), t('admin.coupons.minOrder'), t('admin.common.used'), t('admin.common.date'), t('admin.common.status'), t('admin.common.actions')]}>
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-brand-600">{c.code}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-midnight-900">{c.discount}%</td>
                <td className="px-4 py-3 text-slate-600">${c.minOrder}</td>
                <td className="px-4 py-3 text-slate-600">{c.used} / {c.limit}</td>
                <td className="px-4 py-3 text-slate-500">{c.expires ? formatDate(c.expires) : '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleStatus(c)} className={`text-xs font-semibold px-2 py-1.5 rounded-lg ${c.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                      {c.status === 'active' ? t('admin.common.disabled') : t('admin.common.enabled')}
                    </button>
                    <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="edit" size={16} /></button>
                    <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.coupons.edit') : t('admin.coupons.add')}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('admin.common.code')}><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="SAVE20" /></Field>
            <Field label={t('admin.coupons.percent')}><TextInput type="number" min="1" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required /></Field>
            <Field label={t('admin.coupons.minOrder')}><TextInput type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} /></Field>
            <Field label={t('admin.common.limit')}><TextInput type="number" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} /></Field>
            <Field label={t('admin.common.date')}><TextInput type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} /></Field>
            <Field label={t('admin.common.status')}>
              <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">{t('admin.common.active')}</option>
                <option value="inactive">{t('admin.common.inactive')}</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">{editing ? t('admin.common.save') : t('admin.common.create')}</Button></div>
        </form>
      </Modal>
    </div>
  )
}
