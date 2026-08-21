import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Select, SearchInput, Table, Badge, Button, Modal, Field, TextInput, StatusBadge, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function Users() {
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
    toast(`${u.name} ${next}`)
  }

  const save = (e) => {
    e.preventDefault()
    const id = `u${Date.now().toString().slice(-5)}`
    updateSite((prev) => ({ ...prev, users: [{ id, joined: new Date().toISOString().slice(0, 10), orders: 0, spent: 0, ...form }, ...prev.users] }))
    toast('User created')
    setOpen(false)
  }

  return (
    <div>
      <SectionTitle
        title="Users"
        subtitle={`${users.length} registered users`}
        actions={<Button onClick={() => { setForm({ name: '', email: '', role: 'customer', status: 'active' }); setOpen(true) }}><Icon name="plus" size={15} /> Add user</Button>}
      />
      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2"><SearchInput value={q} onChange={setQ} placeholder="Search name or email..." /></div>
          <Select value={role} onChange={(e) => setRole(e.target.value)} options={[{ value: 'all', label: 'All roles' }, { value: 'customer', label: 'Customers' }, { value: 'seller', label: 'Sellers' }]} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="user" title="No users found" /> : (
          <Table head={['User', 'Email', 'Role', 'Orders', 'Spent', 'Status', 'Actions']}>
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">{u.name[0]}</span>
                    <span className="font-semibold text-midnight-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3"><Badge tone={u.role === 'seller' ? 'purple' : 'blue'}>{u.role}</Badge></td>
                <td className="px-4 py-3 text-slate-600">{u.orders}</td>
                <td className="px-4 py-3 font-semibold text-midnight-900">${u.spent.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(u)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add user">
        <form onSubmit={save} className="space-y-4">
          <Field label="Name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Role">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[{ value: 'customer', label: 'Customer' }, { value: 'seller', label: 'Seller' }]} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]} />
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">Create user</Button></div>
        </form>
      </Modal>
    </div>
  )
}
