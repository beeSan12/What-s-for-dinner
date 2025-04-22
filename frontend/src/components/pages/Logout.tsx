/**
 * This component is responsible for the registration page of the application.
 * It allows users to create a new account by providing their personal information.
 * After successful registration, users are redirected to the login page.
 * 
 * @component Logout
 * @author Beatriz Sanssi
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token') // Remove token from local storage
    navigate('/login') // Redirect to login page
  }, [navigate])

  return <p>Logging out...</p>
}

export default Logout