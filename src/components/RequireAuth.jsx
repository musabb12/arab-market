import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

/**
 * Protect routes. When settings.requireLogin is false, guests may browse
 * unless `always` is set (account, checkout, seller, etc.).
 */
export default function RequireAuth({ children, always = false }) {
  const { user, settings } = useStore()
  const location = useLocation()
  const requireLogin = settings?.requireLogin !== false

  if (!user && (always || requireLogin)) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}
