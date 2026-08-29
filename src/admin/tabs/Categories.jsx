import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Textarea, Toggle, Table, SearchInput, Badge } from '../ui.jsx'
import { catName } from '../../utils/catalog.js'
import Icon from '../../components/Icons.jsx'

const gradients = ['from-brand-500 to-indigo-600', 'from-rose-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-purple-500 to-violet-600', 'from-sky-500 to-blue-600']

export default function Categories() {
  const { t } = useTranslation()
  const { siteData, updateSite, products, toast } = useStore()
  const { categories } = siteData
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', image: '', gradient: gradients[0], subcategories: '', active: true })

  const list = categories.filter((c) => catName(c).toLowerCase().includes(q.toLowerCase()))

  const openNew = () => { setEditing(null); setForm({ name: '', image: '', gradient: gradients[0], subcategories: '', active: true }); setOpen(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: catName(c), image: c.image, gradient: c.gradient, subcategories: c.subcategories.join(', '), active: c.active !== false }); setOpen(true) }

  const save = (e) => {
    e.preventDefault()
    const payload = { ...form, subcategories: form.subcategories.split(',').map((s) => s.trim()).filter(Boolean), name: form.name, nameKey: form.name }
    if (editing) {
      updateSite((prev) => ({ ...prev, categories: prev.categories.map((c) => (c.id === editing.id ? { ...c, ...payload } : c)) }))
      toast(t('admin.common.saved'))
    } else {
      const id = `c${Date.now().toString().slice(-5)}`
      updateSite((prev) => ({ ...prev, categories: [...prev.categories, { id, ...payload }] }))
      toast(t('admin.common.saved'))
    }
    setOpen(false)
  }

  const remove = (id) => {
    updateSite((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }))
    toast(t('admin.common.delete'), 'info')
  }

  const countFor = (id) => products.filter((p) => p.category === id).length

  return (
    <div>
      <SectionTitle
        title={t('admin.categories.title')}
        subtitle={t('admin.categories.subtitle', { count: categories.length })}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> {t('admin.categories.add')}</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder={t('admin.categories.search')} /></Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">{t('admin.categories.empty')}</p>
        ) : (
          <Table head={[t('admin.common.category'), t('admin.sellers.products'), t('admin.common.description'), t('admin.common.status'), t('admin.common.actions')]}>
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
                    <span className="font-semibold text-midnight-900">{catName(c)}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge tone="blue">{countFor(c.id)}</Badge></td>
                <td className="px-4 py-3 text-slate-600 max-w-[280px] truncate">{c.subcategories.join(', ')}</td>
                <td className="px-4 py-3"><Badge tone={c.active !== false ? 'green' : 'gray'}>{c.active !== false ? t('admin.common.active') : t('admin.common.inactive')}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="edit" size={16} /></button>
                    <button onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.categories.edit') : t('admin.categories.add')}>
        <form onSubmit={save} className="space-y-4">
          <Field label={t('admin.common.name')}><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label={t('admin.common.imageUrl')}><TextInput value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." /></Field>
          <Field label={t('admin.common.description')}><Textarea rows={2} value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} /></Field>
          <Field label={t('admin.common.image')}>
            <div className="flex flex-wrap gap-2">
              {gradients.map((g) => (
                <button type="button" key={g} onClick={() => setForm({ ...form, gradient: g })} className={`h-9 w-14 rounded-xl bg-gradient-to-br ${g} ${form.gradient === g ? 'ring-2 ring-midnight-900 ring-offset-2' : 'opacity-70'}`} />
              ))}
            </div>
          </Field>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Toggle checked={form.active !== false} onChange={(v) => setForm({ ...form, active: v })} />
              <span className="text-sm font-medium text-slate-600">{t('admin.categories.visible')}</span>
            </div>
            <Button type="submit">{editing ? t('admin.common.save') : t('admin.common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
