/**
 * The navbar component is a navigation bar that provides links to different pages of the application.
 * 
 * @component Navbar
 * @author Beatriz Sanssi
 */

import { FaHome, FaSearch, FaUnlock } from "react-icons/fa"
import { IoCreate, IoLogOutOutline } from "react-icons/io5"
import { RiUserAddLine } from "react-icons/ri"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [localStorage.getItem('token')]) // Dependency array to re-run effect when token changes

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <div style={styles.navbar}>    
       <Link to="/" style={styles.link}>
        <FaHome size={20} />
        <span style={styles.label}>Home</span>
      </Link>
      {isLoggedIn ? (
        <>
         <Link to="/search" style={styles.link}>
            <FaSearch size={20} />
            <span style={styles.label}>Search</span>
          </Link>
          <Link to="/create-shopping-list" style={styles.link}>
            <IoCreate size={20} />
            <span style={styles.label}>Create List</span>
          </Link>
          <button onClick={handleLogout} style={{ ...styles.link, ...styles.button }}>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    padding: "10px",
    position: "fixed",
    top: '5%',
    left: 0,
    width: "100%",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    zIndex: 1000,
    borderBottom: "3px solid #444"
  },
  link: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textDecoration: "none",
    color: "#fff",
    fontSize: "14px"
  },
  label: {
    marginTop: "3px",
    fontSize: "12px"
  },
  button: {
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "white",
    textDecoration: "underline"
  },
} as const
