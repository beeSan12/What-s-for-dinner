/**
 * This component allows users to log in to the application.
 * 
 * @component LoginForm
 * @author Beatriz Sanssi
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import imageWoman from '../../images/woman-shopping.png'

/**
 * LoginForm component
 */
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')  // Redirect to home if already logged in
    }
  }, [navigate])

  /**
   * Handles the login action when the user clicks the login button.
   * It sends a POST request to the backend API with the user's credentials.
   */
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setError('')
        navigate('/')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error logging in')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.pictureDiv}>
        <img src={imageWoman} alt="Shopping woman" style={styles.image} />
      </div>
      <div style={styles.loginBox}>
        <h1 style={styles.heading}>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {loading && <p>Loading...</p>}
  
        <button onClick={handleSubmit}>Login</button>
        <p style={styles.text}>
          No Account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
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
    backgroundColor: "#b0c4de",
    padding: '20px',
    boxSizing: 'border-box',
    backgroundRepeat: "no-repeat",
    width: "100vw",
    gap: "20px",
  },
  pictureDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    position: "absolute",
    left: "80px",
    maxHeight: "60%",
    zIndex: 1
  },
  // overlay: {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   zIndex: 1,
  // },
  loginBox: {
    width: "90%",
    maxWidth: "350px",
    borderRadius: "10px",
    position: "relative",
    zIndex: 2,
    background: "rgba(255, 255, 255, 0.9)",
    backgroundColor: '#f0f0f0',
    opacity: 0.9,
    padding: "30px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    fontSize: "20px",
  },
  button: {
    width: "100%",
    marginTop: "10px",
    fontSize: "16px",
    backgroundColor: "#b0c4de",
  },
  text: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#696969",
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
} as const

export default LoginForm