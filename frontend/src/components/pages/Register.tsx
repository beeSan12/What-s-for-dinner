/**
 * This component is responsible for the registration page of the application.
 * It allows users to create a new account by providing their personal information.
 * After successful registration, users are redirected to the login page.
 *
 * @component Register
 * @author Beatriz Sanssi
 */

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import imageWoman from '../../images/woman-shopping.png'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/')
  }, [navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      )

      const data = await response.json()

      if (response.ok) {
        navigate('/login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.pictureDiv}>
        <img src={imageWoman} alt="Shopping woman" style={styles.image} />
      </div>
      <div style={styles.loginBox}>
        <h1 style={styles.heading}>Register</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={styles.text}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#b0c4de',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    gap: '20px',
  },
  pictureDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    left: '80px',
    maxHeight: '60%',
    zIndex: 1,
  },
  loginBox: {
    width: '90%',
    maxWidth: '350px',
    borderRadius: '10px',
    position: 'relative',
    justifyContent: 'space-between',
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: '#f0f0f0',
    opacity: 0.9,
    padding: '30px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    margin: '20px',
  },
  heading: {
    color: '#333',
    fontSize: '20px',
  },
  button: {
    width: '100%',
    marginTop: '10px',
    fontSize: '16px',
    backgroundColor: '#b0c4de',
  },
  text: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#696969',
    fontWeight: 'bold',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
} as const
