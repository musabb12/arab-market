import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Table, Badge, Select, Button, Modal, Empty, StatusBadge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Tickets() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { tickets } = siteData
  const [status, setStatus] = useState('all')
  const [active, setActive] = useState(null)
  const [reply, setReply] = useState('')

  const list = tickets.filter((tk) => status === 'all' || tk.status === status)

  const priorityLabel = (p) => t(`admin.tickets.${p}`, { defaultValue: p })

  const statusOptions = [
    { value: 'all', label: t('admin.common.all') },
    { value: 'open', label: t('admin.status.open') },
    { value: 'pending', label: t('admin.common.pending') },
    { value: 'closed', label: t('admin.status.closed') }
  ]

  const setStatusOf = (id, s) => {
    updateSite((prev) => ({ ...prev, tickets: prev.tickets.map((tk) => (tk.id === id ? { ...tk, status: s } : tk)) }))
    toast(t(`admin.status.${s}`, { defaultValue: t(`admin.common.${s}`, { defaultValue: s }) }))
  }

  const sendReply = () => {
    if (!reply.trim()) return
    updateSite((prev) => ({
      ...prev,
      tickets: prev.tickets.map((tk) => (tk.id === active.id ? { ...tk, messages: [...tk.messages, reply.trim()], status: tk.status === 'open' ? 'pending' : tk.status } : tk))
    }))
    toast(t('admin.common.saved'))
    setReply('')
  }

  return (
    <div>
      <SectionTitle title={t('admin.tickets.title')} subtitle={t('admin.tickets.subtitle', { count: tickets.length })} />

      <Card className="mb-5">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} className="max-w-xs" />
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="chat" title={t('admin.tickets.empty')} /> : (
          <Table head={[t('admin.tickets.subject'), t('admin.common.customer'), t('admin.tickets.priority'), t('admin.common.status'), t('admin.common.items'), t('admin.common.date'), t('admin.common.actions')]}>
            {list.map((tk) => (
              <tr key={tk.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-midnight-900">{tk.subject}</p>
                  <p className="text-xs text-slate-400">{tk.id}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-600 text-sm">{tk.customer}</p>
                  <p className="text-xs text-slate-400">{tk.email}</p>
                </td>
                <td className="px-4 py-3"><Badge tone={tk.priority === 'high' ? 'red' : tk.priority === 'medium' ? 'amber' : 'blue'}>{priorityLabel(tk.priority)}</Badge></td>
                <td className="px-4 py-3"><StatusBadge status={tk.status} /></td>
                <td className="px-4 py-3 text-slate-600">{tk.messages.length}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{tk.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setActive(tk)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="eye" size={16} /></button>
                    <Select
                      value={tk.status}
                      onChange={(e) => setStatusOf(tk.id, e.target.value)}
                      options={statusOptions.filter((o) => o.value !== 'all')}
                      className="!py-1.5 !text-xs w-32"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.subject || t('admin.tickets.title')} width="max-w-2xl">
        {active && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge tone={active.priority === 'high' ? 'red' : active.priority === 'medium' ? 'amber' : 'blue'}>{priorityLabel(active.priority)}</Badge>
              <StatusBadge status={active.status} />
              <span className="text-xs text-slate-400">{active.customer} · {active.email}</span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 mb-4">
              {active.messages.map((m, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-slate-100 text-slate-700' : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white'}`}>
                    {m}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                placeholder={t('admin.common.search')}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
              />
              <Button onClick={sendReply}><Icon name="arrowRight" size={15} /> {t('admin.common.save')}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
