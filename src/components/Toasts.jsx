import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

const styles = {
  success: 'bg-midnight-900 text-white',
  info: 'bg-slate-700 text-white',
  error: 'bg-red-600 text-white'
}

export default function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lift text-sm font-medium ${styles[toast.type]}`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Icon name="check" size={14} />
            </span>
            <span>{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">
              <Icon name="close" size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
