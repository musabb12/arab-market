import React from 'react'
import { motion } from 'framer-motion'

export default function SectionHeader({ title, subtitle, align = 'center', className = '' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55 }}
      className={`max-w-2xl ${alignCls} mb-10 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4 justify-center">
        <span className="h-px w-10 bg-brand-500" />
        <span className="h-2 w-2 rotate-45 bg-brand-500" />
        <span className="h-px w-10 bg-brand-500" />
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-midnight-900 dark:text-white mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>}
    </motion.div>
  )
}
