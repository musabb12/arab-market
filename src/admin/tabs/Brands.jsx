import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Textarea, Toggle, Table, SearchInput, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

const gradients = ['from-brand-500 to-indigo-600', 'from-rose-500 to-pink-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-purple-500 to-violet-600', 'from-sky-500 to-blue-600']

export default function Brands() {
  const { siteData, updateSite, products, toast } = useStore()
  const { brands, categories } = siteData
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', logo: '', country: '', description: '', category: '', gradient: gradients[0] })

  const list = brands.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()))

  const openNew = () => { setEditing(null); setForm({ name: '', logo: '', country: '', description: '', category: categories[0]?.id || '', gradient: gradients[0] }); setOpen(true) }
  const openEdit = (b) => { setEditing(b); setForm(b); setOpen(true) }

  const save = (e) => {
    e.preventDefault()
    if (editing) {
      updateSite((prev) => ({ ...prev, brands: prev.brands.map((b) => (b.id === editing.id ? { ...b, ...form } : b)) }))
      toast('Brand updated')
    } else {
      const id = `b${Date.now().toString().slice(-5)}`
      updateSite((prev) => ({ ...prev, brands: [...prev.brands, { id, ...form }] }))
      toast('Brand created')
    }
    setOpen(false)
  }

  const remove = (id) => {
    updateSite((prev) => ({ ...prev, brands: prev.brands.filter((b) => b.id !== id) }))
    toast('Brand removed', 'info')
  }

  const countFor = (id) => products.filter((p) => p.brand === id).length

  return (
    <div>
      <SectionTitle
        title="Brands"
        subtitle={`${brands.length} brands`}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> Add brand</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder="Search brands..." /></Card>

      <Card className="overflow-hidden">
        <Table head={['Brand', 'Category', 'Products', 'Country', 'Actions']}>
          {list.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${b.gradient} text-white font-bold`}>{b.logo}</span>
                  <span className="font-semibold text-midnight-900">{b.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{categories.find((c) => c.id === b.category)?.name || '—'}</td>
              <td className="px-4 py-3"><Badge tone="blue">{countFor(b.id)}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{b.country}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="edit" size={16} /></button>
                  <button onClick={() => remove(b.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit brand' : 'Add brand'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Logo (1-2 chars)"><TextInput value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} required maxLength={2} /></Field>
            <Field label="Country"><TextInput value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
            <Field label="Category">
              <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand-400" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Description" className="sm:col-span-2"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <Field label="Brand gradient">
            <div className="flex flex-wrap gap-2">
              {gradients.map((g) => (
                <button type="button" key={g} onClick={() => setForm({ ...form, gradient: g })} className={`h-9 w-14 rounded-xl bg-gradient-to-br ${g} ${form.gradient === g ? 'ring-2 ring-midnight-900 ring-offset-2' : 'opacity-70'}`} />
              ))}
            </div>
          </Field>
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button type="submit">{editing ? 'Save changes' : 'Create brand'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
