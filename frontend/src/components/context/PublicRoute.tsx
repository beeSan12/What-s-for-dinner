/**
 * This component is used to protect routes that should only be accessible to unauthenticated users.
 *
 * @component PublicRoute
 * @author Beatriz Sanssi
 */

import { JSX } from 'react'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/home" replace /> : <>{children}</>
  // if (token) {
  //   return <Navigate to="/home" replace />
  // }

  // return children
}
