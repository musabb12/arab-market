import React from 'react'
import { Link } from 'react-router-dom'

const SIZE = {
  sm: 'h-14 w-14',
  md: 'h-[74px] w-[74px] md:h-[6.5rem] md:w-[6.5rem]',
  lg: 'h-20 w-20 md:h-[7.5rem] md:w-[7.5rem]'
}

/** SHEIN-style circular category / subcategory link used across the storefront. */
export default function CircleLink({ to, state, image, label, size = 'md', className = '', light = false }) {
  return (
    <Link
      to={to}
      state={state}
      className={`group flex flex-col items-center gap-2 shrink-0 ${className || 'w-[78px] md:w-auto'}`}
    >
      <span className={`relative block ${SIZE[size] || SIZE.md} rounded-full p-[2.5px] bg-gradient-to-br from-amber-200 via-amber-600 to-amber-300 shadow-[0_10px_25px_-15px_rgba(180,120,20,0.8)]`}>
        <span className="block h-full w-full overflow-hidden rounded-full bg-white dark:bg-midnight-950 p-[2px]">
          <img
            src={image}
            alt={label}
            loading="lazy"
            className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </span>
      </span>
      <span className={`text-[11px] md:text-[13px] font-semibold text-center leading-tight transition-colors line-clamp-2 ${light ? 'text-white/85 group-hover:text-amber-300' : 'text-midnight-900 dark:text-white group-hover:text-brand-600'}`}>
        {label}
      </span>
    </Link>
  )
}
