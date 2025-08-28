/**
 * The navbar component is a navigation bar that provides links to different pages of the application.
 *
 * @component Navbar
 * @author Beatriz Sanssi
 */

import { FaHome, FaSearch, FaUnlock } from 'react-icons/fa'
import { IoLogOutOutline } from 'react-icons/io5'
import { MdOutlineAutoGraph } from 'react-icons/md'
import { RiUserAddLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div style={styles.navbar}>
      <Link to="/" style={styles.link}>
        <FaHome size={20} />
        <span style={styles.label}>Home</span>
      </Link>
      {isAuthenticated ? (
        <>
          <Link to="/search" style={styles.link}>
            <FaSearch size={20} />
            <span style={styles.label}>Search</span>
          </Link>
          <Link to="/visualize" style={styles.link}>
            <MdOutlineAutoGraph size={20} />
            <span style={styles.label}>Visualization</span>
          </Link>
          <button onClick={logout} style={{ ...styles.link, ...styles.button }}>
            <IoLogOutOutline size={20} />
            <span style={styles.label}>Logout</span>
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={styles.link}>
            <FaUnlock size={20} />
            <span style={styles.label}>Login</span>
          </Link>
          <Link to="/register" style={styles.link}>
            <RiUserAddLine size={20} />
            <span style={styles.label}>Register</span>
          </Link>
        </>
      )}
    </div>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    padding: '0px',
    position: 'fixed',
    left: 0,
    width: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    zIndex: 1000,
    borderBottom: '3px solid #444',
  },
  link: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textDecoration: 'none',
    color: '#fff',
    fontSize: '14px',
  },
  label: {
    marginTop: '3px',
    fontSize: '12px',
  },
  button: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'underline',
  },
} as const
