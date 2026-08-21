import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Table, Badge, Button, Modal, Field, TextInput, Toggle, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function AdminUsers() {
  const { siteData, updateSite, adminSession, toast } = useStore()
  const { adminUsers } = siteData
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'admin', active: true })

  const save = (e) => {
    e.preventDefault()
    if (!form.username || !form.password) return
    const id = `a${Date.now().toString().slice(-4)}`
    updateSite((prev) => ({ ...prev, adminUsers: [...prev.adminUsers, { id, ...form }] }))
    toast('Admin user created')
    setOpen(false)
  }

  const toggle = (id, active) => {
    updateSite((prev) => ({ ...prev, adminUsers: prev.adminUsers.map((u) => (u.id === id ? { ...u, active } : u)) }))
    toast(`User ${active ? 'activated' : 'deactivated'}`)
  }

  const roleTone = { admin: 'purple', manager: 'blue', support: 'green' }

  return (
    <div>
      <SectionTitle
        title="Admin Users"
        subtitle="People with access to this control center"
        actions={<Button onClick={() => { setForm({ name: '', username: '', password: '', role: 'admin', active: true }); setOpen(true) }}><Icon name="plus" size={15} /> Add admin</Button>}
      />

      <Card className="overflow-hidden">
        {adminUsers.length === 0 ? <Empty icon="shield" title="No admin users" /> : (
          <Table head={['Name', 'Username', 'Role', 'Status', 'Actions']}>
            {adminUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">{u.name?.[0] || u.username[0]}</span>
                    <span className="font-semibold text-midnight-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-600">{u.username}</td>
                <td className="px-4 py-3"><Badge tone={roleTone[u.role] || 'gray'}>{u.role}</Badge></td>
                <td className="px-4 py-3">
                  {u.id === adminSession?.id ? (
                    <Badge tone="blue">You</Badge>
                  ) : (
                    <Toggle checked={u.active !== false} onChange={(v) => toggle(u.id, v)} />
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{u.role === 'admin' ? 'Full access' : 'Limited access'}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add admin user">
        <form onSubmit={save} className="space-y-4">
          <Field label="Display name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username"><TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></Field>
            <Field label="Password"><TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Field>
          </div>
          <Field label="Role">
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="support">Support</option>
            </select>
          </Field>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">Create admin user</Button></div>
        </form>
      </Modal>
    </div>
  )
}
