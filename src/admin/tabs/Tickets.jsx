import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Table, Badge, Select, Button, Modal, Empty, StatusBadge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Tickets() {
  const { siteData, updateSite, toast } = useStore()
  const { tickets } = siteData
  const [status, setStatus] = useState('all')
  const [active, setActive] = useState(null)
  const [reply, setReply] = useState('')

  const list = tickets.filter((t) => status === 'all' || t.status === status)

  const setStatusOf = (id, s) => {
    updateSite((prev) => ({ ...prev, tickets: prev.tickets.map((t) => (t.id === id ? { ...t, status: s } : t)) }))
    toast(`Ticket ${s}`)
  }

  const sendReply = () => {
    if (!reply.trim()) return
    updateSite((prev) => ({
      ...prev,
      tickets: prev.tickets.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, reply.trim()], status: t.status === 'open' ? 'pending' : t.status } : t))
    }))
    toast('Reply sent to customer')
    setReply('')
  }

  return (
    <div>
      <SectionTitle title="Support Tickets" subtitle="Resolve customer queries directly" />

      <Card className="mb-5">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} options={[{ value: 'all', label: 'All tickets' }, { value: 'open', label: 'Open' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }]} className="max-w-xs" />
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon="chat" title="No tickets found" /> : (
          <Table head={['Ticket', 'Customer', 'Priority', 'Status', 'Messages', 'Date', 'Actions']}>
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-midnight-900">{t.subject}</p>
                  <p className="text-xs text-slate-400">{t.id}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-600 text-sm">{t.customer}</p>
                  <p className="text-xs text-slate-400">{t.email}</p>
                </td>
                <td className="px-4 py-3"><Badge tone={t.priority === 'high' ? 'red' : t.priority === 'medium' ? 'amber' : 'blue'}>{t.priority}</Badge></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-slate-600">{t.messages.length}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setActive(t)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600"><Icon name="eye" size={16} /></button>
                    <Select
                      value={t.status}
                      onChange={(e) => setStatusOf(t.id, e.target.value)}
                      options={[{ value: 'open', label: 'Open' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }]}
                      className="!py-1.5 !text-xs w-32"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.subject || 'Ticket'} width="max-w-2xl">
        {active && (
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge tone={active.priority === 'high' ? 'red' : active.priority === 'medium' ? 'amber' : 'blue'}>{active.priority} priority</Badge>
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
                placeholder="Type your reply..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50"
              />
              <Button onClick={sendReply}><Icon name="arrowRight" size={15} /> Send</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
