import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../components/Icons.jsx'

export function SectionTitle({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-semibold text-midnight-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ title, subtitle, actions, children, className = '', bodyClass = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-soft ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="font-semibold text-midnight-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClass}`}>{children}</div>
    </div>
  )
}

export function Stat({ icon, label, value, delta, color = 'from-brand-500 to-indigo-600', hint }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-glow`}>
          <Icon name={icon} size={20} />
        </span>
        {delta && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-midnight-900 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${checked ? 'bg-brand-600' : 'bg-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'start-[22px]' : 'start-0.5'}`} />
    </button>
  )
}

export const inputClass = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-50 transition-all bg-white'

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</span>}
      {children}
      {hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

export function Select({ options, children, className = '', ...props }) {
  return (
    <select {...props} className={`${inputClass} ${className}`}>
      {options
        ? options.map((o) => (
            <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
              {typeof o === 'string' ? o : o.label}
            </option>
          ))
        : children}
    </select>
  )
}

export function Textarea(props) {
  return <textarea {...props} className={`${inputClass} resize-none ${props.className || ''}`} />
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const styles = {
    primary: 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:shadow-glow',
    dark: 'bg-midnight-900 text-white hover:bg-midnight-800',
    outline: 'border border-slate-200 text-midnight-900 hover:border-brand-400 hover:text-brand-600 bg-white',
    ghost: 'text-slate-500 hover:text-midnight-900 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm'
  }
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

const badgeTones = {
  gray: 'bg-slate-100 text-slate-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-brand-50 text-brand-600',
  purple: 'bg-purple-50 text-purple-600'
}

export function Badge({ tone = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const { t } = useTranslation()
  const map = {
    approved: 'green', active: 'green', confirmed: 'green', delivered: 'green', resolved: 'green',
    pending: 'amber', processing: 'amber', shipped: 'blue', cancelled: 'red', rejected: 'red',
    suspended: 'red', closed: 'gray', open: 'amber', published: 'green', draft: 'gray', low: 'amber',
    inactive: 'gray'
  }
  const commonStatuses = ['active', 'inactive', 'pending', 'approved', 'suspended']
  const label = commonStatuses.includes(status)
    ? t(`admin.common.${status}`)
    : t(`admin.status.${status}`, { defaultValue: status })
  return <Badge tone={map[status] || 'gray'}>{label}</Badge>
}

export function Modal({ open, onClose, title, children, width = 'max-w-2xl' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-midnight-900/60 backdrop-blur-sm flex items-start justify-center p-4 md:p-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl shadow-lift w-full ${width} my-auto`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-display text-lg font-semibold text-midnight-900">{title}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-midnight-900 transition-colors">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Empty({ icon = 'box', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
        <Icon name={icon} size={30} />
      </span>
      <p className="font-semibold text-midnight-900">{title}</p>
      {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-sm">{subtitle}</p>}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Icon name="search" size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} ps-10`}
      />
    </div>
  )
}

export function AdminCardGrid({ children, className = '' }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  )
}

export function AdminIconButton({ icon, onClick, title, variant = 'default', className = '' }) {
  const variants = {
    default: 'hover:bg-slate-100 text-slate-500 hover:text-brand-600',
    danger: 'hover:bg-red-50 text-slate-500 hover:text-red-600',
    success: 'hover:bg-emerald-50 text-slate-500 hover:text-emerald-600'
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-xl transition-colors ${variants[variant]} ${className}`}
    >
      <Icon name={icon} size={16} />
    </button>
  )
}

export function AdminEntityCard({
  image,
  imageAlt = '',
  gradient,
  topBadges = [],
  title,
  subtitle,
  meta = [],
  footer,
  children,
  className = ''
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 ${className}`}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : gradient ? (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/75 via-midnight-900/15 to-transparent" />
        {topBadges.length > 0 && (
          <div className="absolute top-3 start-3 end-3 flex flex-wrap gap-1.5">
            {topBadges.map((b, i) => (
              <Badge key={i} tone={b.tone || 'gray'} className="backdrop-blur-sm bg-white/90 shadow-sm">
                {b.label}
              </Badge>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 drop-shadow-sm">{title}</h3>
          {subtitle && <p className="text-xs text-white/75 mt-1 truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        {meta.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {meta.map((m, i) => (
              <div key={i} className="rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{m.label}</p>
                <p className="text-sm font-semibold text-midnight-900 mt-0.5 truncate">{m.value}</p>
              </div>
            ))}
          </div>
        )}
        {children}
        {footer && (
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {footer}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function Table({ head, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">{children}</tbody>
      </table>
    </div>
  )
}

export function Bar({ value, max, color = 'bg-brand-500' }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-500 w-12 text-end">{pct.toFixed(0)}%</span>
    </div>
  )
}
