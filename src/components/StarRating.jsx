import React from 'react'
import Icon from './Icons.jsx'

export default function StarRating({ rating, size = 16, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-300'}>
          <Icon name="star" size={size} className={i <= Math.round(rating) ? 'fill-current' : ''} strokeWidth={i <= Math.round(rating) ? 0 : 1.8} />
        </span>
      ))}
    </div>
  )
}
