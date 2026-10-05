import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

function getTarget() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(23, 59, 59, 0)
  return midnight
}

export default function CountdownTimer({ target: targetProp, className = '' }) {
  const { t } = useTranslation()
  const target = useMemo(() => targetProp || getTarget(), [targetProp])
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    const compute = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now())
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      })
    }
    compute()
    const id = setInterval(compute, 1000)
    return () => clearInterval(id)
  }, [target])

  const cells = [
    { v: left.d, l: t('common.days') },
    { v: left.h, l: t('common.hours') },
    { v: left.m, l: t('common.minutes') },
    { v: left.s, l: t('common.seconds') }
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`} dir="ltr">
      {cells.map((c, i) => (
        <React.Fragment key={c.l}>
          <div className="flex flex-col items-center bg-white text-midnight-900 rounded-xl px-3 py-2 min-w-[56px]">
            <span className="text-xl font-bold tabular-nums">{String(c.v).padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">{c.l}</span>
          </div>
          {i < cells.length - 1 && <span className="text-lg font-bold opacity-60">:</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
