/**
 * This component is used to protect routes that should only be accessible to authenticated users.
 *
 * @component PrivateRoute
 * @author Beatriz Sanssi
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * PrivateRoute component that checks if the user is authenticated before rendering its children.
 *
 * @returns {JSX.Element} The PrivateRoute component or a redirect to the login page if the user is not authenticated.
 */
export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <p>Loading…</p>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
