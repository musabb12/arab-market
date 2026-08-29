import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Select, SearchInput, Table, Badge, Button, Modal, Field, TextInput, StatusBadge, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function Users() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { users } = siteData
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'customer', status: 'active' })

  const list = users.filter((u) => {
    if (role !== 'all' && u.role !== role) return false
    if (q && !u.name.toLowerCase().includes(q.toLowerCase()) && !u.email.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const toggleStatus = (u) => {
    const next = u.status === 'active' ? 'suspended' : 'active'
    updateSite((prev) => ({ ...prev, users: prev.users.map((x) => (x.id === u.id ? { ...x, status: next } : x)) }))
    toast(t(`admin.common.${next}`))
  }

  const save = (e) => {
    e.preventDefault()
    const id = `u${Date.now().toString().slice(-5)}`
    updateSite((prev) => ({ ...prev, users: [{ id, joined: new Date().toISOString().slice(0, 10), orders: 0, spent: 0, ...form }, ...prev.users] }))
    toast(t('admin.common.saved'))
    setOpen(false)
  }

  return (
    <div>
      <SectionTitle
        title={t('admin.users.title')}
        subtitle={t('admin.users.subtitle', { count: users.length })}
        actions={<Button onClick={() => { setForm({ name: '', email: '', role: 'customer', status: 'active' }); setOpen(true) }}><Icon name="plus" size={15} /> {t('admin.users.add')}</Button>}
      />
      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2"><SearchInput value={q} onChange={setQ} placeholder={t('admin.users.search')} /></div>
          <Select value={role} onChange={(e) => setRole(e.target.value)} options={[
            { value: 'all', label: t('admin.common.all') },
            { value: 'customer', label: t('admin.roles.customer') },
            { value: 'seller', label: t('admin.roles.seller') }
          ]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="user" title={t('admin.users.empty')} /> : (
          <Table head={[t('admin.common.name'), t('admin.common.email'), t('admin.common.role'), t('admin.users.orders'), t('admin.users.spent'), t('admin.common.status'), t('admin.common.actions')]}>
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">{u.name[0]}</span>
                    <span className="font-semibold text-midnight-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3"><Badge tone={u.role === 'seller' ? 'purple' : 'blue'}>{t(`admin.roles.${u.role}`, { defaultValue: u.role })}</Badge></td>
                <td className="px-4 py-3 text-slate-600">{u.orders}</td>
                <td className="px-4 py-3 font-semibold text-midnight-900">${u.spent.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(u)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                    {u.status === 'active' ? t('admin.common.suspend') : t('admin.common.active')}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={t('admin.users.add')}>
        <form onSubmit={save} className="space-y-4">
          <Field label={t('admin.common.name')}><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label={t('admin.common.email')}><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.common.role')}>
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[
                { value: 'customer', label: t('admin.roles.customer') },
                { value: 'seller', label: t('admin.roles.seller') }
              ]} />
            </Field>
            <Field label={t('admin.common.status')}>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
                { value: 'active', label: t('admin.common.active') },
                { value: 'suspended', label: t('admin.common.suspended') }
              ]} />
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">{t('admin.users.create')}</Button></div>
        </form>
      </Modal>
    </div>
  )
}
