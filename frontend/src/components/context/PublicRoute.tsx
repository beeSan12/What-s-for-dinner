/**
 * This component is used to protect routes that should only be accessible to unauthenticated users.
 * 
 * @component PublicRoute
 * @author Beatriz Sanssi
 */

import { JSX } from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute