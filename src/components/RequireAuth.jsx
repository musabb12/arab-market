import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

/** Protect shopping routes — guests are sent to login with a return path. */
export default function RequireAuth({ children }) {
  const { user } = useStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}
