/**
 * This component allows users to log in to the application.
 * 
 * @component LoginForm
 * @author Beatriz Sanssi
 */
import React, { useState } from 'react'

/**
 * LoginForm component
 */
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  /**
   * Handles the login action when the user clicks the login button.
   * It sends a POST request to the backend API with the user's credentials.
   */
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setMessage('Login successful!')
      } else {
        setMessage(data.error || 'Login failed')
      }
    } catch (err) {
      setMessage('Error logging in')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSubmit}>Login</button>
      <p>{message}</p>
    </div>
  )
}

export default LoginForm