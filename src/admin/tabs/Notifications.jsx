import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Badge, Button } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

export default function Notifications() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { notifications } = siteData

  const markRead = (id) => {
    updateSite((prev) => ({ ...prev, notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
  }

  const markAllRead = () => {
    updateSite((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }))
    toast(t('admin.common.saved'))
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <div>
      <SectionTitle
        title={t('admin.notifications.title')}
        subtitle={t('admin.notifications.subtitle', { count: unread })}
        actions={unread > 0 && <Button variant="outline" onClick={markAllRead}><Icon name="check" size={15} /> {t('admin.notifications.markAll')}</Button>}
      />

      <Card>
        {notifications.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">{t('admin.notifications.empty')}</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <button key={n.id} onClick={() => markRead(n.id)} className="w-full flex items-start gap-4 py-4 text-left hover:bg-slate-50/50 rounded-xl px-3 transition-colors">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand-500'}`} />
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.read ? 'bg-slate-50 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                  <Icon name={n.icon || 'bell'} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold text-midnight-900 ${n.read ? 'font-medium text-slate-500' : ''}`}>{n.title}</p>
                    {!n.read && <Badge tone="blue">{t('admin.common.new')}</Badge>}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.date}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
