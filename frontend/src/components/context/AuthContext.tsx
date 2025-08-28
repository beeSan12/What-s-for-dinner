/**
 * This module provides a custom hook to access the authentication context.
 *
 * @module AuthContext
 * @author Beatriz Sanssi
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * AuthContextType defines the shape of the authentication context.
 *
 * @interface AuthContextType
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {boolean} loading - Indicates if the authentication status is being loaded.
 * @property {function} logout - Function to log out the user.
 */
export interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

/**
 * Create a context for authentication with default values.
 */
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

/**
 * AuthProvider component that wraps the application and provides authentication context.
 *
 * @param {ReactNode} children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('token') // Remove invalid token
      setIsAuthenticated(false)
    }
    setLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
