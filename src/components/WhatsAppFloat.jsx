import React from 'react'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'
import { getWhatsAppUrl } from '../utils/social.js'

export default function WhatsAppFloat() {
  const { settings } = useStore()
  if (settings?.whatsappFloat === false) return null
  const url = getWhatsAppUrl(settings)
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed z-40 bottom-[4.9rem] md:bottom-6 start-4 md:start-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift hover:scale-105 active:scale-95 transition-transform"
    >
      <Icon name="whatsapp" size={24} />
    </a>
  )
}
