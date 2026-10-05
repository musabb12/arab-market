import React from 'react'

const SRC = {
  visa: '/payments/visa.svg',
  mastercard: '/payments/mastercard.svg',
  amex: '/payments/amex.svg',
  mada: '/payments/mada.svg',
  paypal: '/payments/paypal.svg',
  applepay: '/payments/applepay.svg',
  googlepay: '/payments/googlepay.svg',
  cod: '/payments/cod.svg',
  card: null
}

const SIZE = {
  sm: { single: 'h-8 md:h-9', card: 'h-7 md:h-8', max: 'max-w-[6.5rem]' },
  md: { single: 'h-11 md:h-12', card: 'h-10 md:h-11', max: 'max-w-[9rem]' },
  lg: { single: 'h-14 md:h-16', card: 'h-12 md:h-14', max: 'max-w-[11rem]' }
}

/** Official brand logos from /public/payments */
export function PaymentBrand({ id, className = '', title, size = 'md' }) {
  const s = SIZE[size] || SIZE.md

  if (id === 'card') {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`} title={title || 'Cards'} role="img" aria-label={title || 'Cards'}>
        <img src={SRC.visa} alt="Visa" className={`${s.card} w-auto object-contain`} loading="lazy" />
        <img src={SRC.mastercard} alt="Mastercard" className={`${s.card} w-auto object-contain`} loading="lazy" />
      </span>
    )
  }

  const src = SRC[id]
  if (!src) return null

  return (
    <span className={`inline-flex items-center justify-center ${className}`} title={title || id} role="img" aria-label={title || id}>
      <img
        src={src}
        alt={title || id}
        className={`${s.single} w-auto ${s.max} object-contain`}
        loading="lazy"
      />
    </span>
  )
}

export const NETWORK_BRANDS = ['mada', 'visa', 'mastercard', 'amex', 'paypal']

export default PaymentBrand
