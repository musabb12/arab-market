import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Table, Badge, Button, Modal, Field, TextInput, Toggle, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function AdminUsers() {
  const { t } = useTranslation()
  const { siteData, updateSite, adminSession, toast } = useStore()
  const { adminUsers } = siteData
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'admin', active: true })

  const save = (e) => {
    e.preventDefault()
    if (!form.username || !form.password) return
    const id = `a${Date.now().toString().slice(-4)}`
    updateSite((prev) => ({ ...prev, adminUsers: [...prev.adminUsers, { id, ...form }] }))
    toast(t('admin.common.saved'))
    setOpen(false)
  }

  const toggle = (id, active) => {
    updateSite((prev) => ({ ...prev, adminUsers: prev.adminUsers.map((u) => (u.id === id ? { ...u, active } : u)) }))
    toast(active ? t('admin.common.active') : t('admin.common.inactive'))
  }

  const roleTone = { admin: 'purple', manager: 'blue', support: 'green' }

  return (
    <div>
      <SectionTitle
        title={t('admin.adminUsers.title')}
        subtitle={t('admin.adminUsers.subtitle')}
        actions={<Button onClick={() => { setForm({ name: '', username: '', password: '', role: 'admin', active: true }); setOpen(true) }}><Icon name="plus" size={15} /> {t('admin.adminUsers.add')}</Button>}
      />

      <Card className="overflow-hidden">
        {adminUsers.length === 0 ? <Empty icon="shield" title={t('admin.adminUsers.empty')} /> : (
          <Table head={[t('admin.common.name'), t('admin.common.username'), t('admin.common.role'), t('admin.common.status'), t('admin.common.actions')]}>
            {adminUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white text-sm font-bold">{u.name?.[0] || u.username[0]}</span>
                    <span className="font-semibold text-midnight-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-600">{u.username}</td>
                <td className="px-4 py-3"><Badge tone={roleTone[u.role] || 'gray'}>{t(`admin.roles.${u.role}`, { defaultValue: u.role })}</Badge></td>
                <td className="px-4 py-3">
                  {u.id === adminSession?.id ? (
                    <Badge tone="blue">{t('admin.common.you')}</Badge>
                  ) : (
                    <Toggle checked={u.active !== false} onChange={(v) => toggle(u.id, v)} />
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{u.role === 'admin' ? t('admin.roles.admin') : t('admin.roles.manager')}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={t('admin.adminUsers.add')}>
        <form onSubmit={save} className="space-y-4">
          <Field label={t('admin.common.name')}><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.common.username')}><TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></Field>
            <Field label={t('admin.common.password')}><TextInput type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Field>
          </div>
          <Field label={t('admin.common.role')}>
            <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">{t('admin.roles.admin')}</option>
              <option value="manager">{t('admin.roles.manager')}</option>
              <option value="support">{t('admin.roles.support')}</option>
            </select>
          </Field>
          <div className="flex justify-end pt-2 border-t border-slate-100"><Button type="submit">{t('admin.adminUsers.create')}</Button></div>
        </form>
      </Modal>
    </div>
  )
}
