/**
 * This component serves as the landing page for the application.
 * It provides links to various functionalities of the app.
 * @author Beatriz Sanssi
 * @component Home
 */

import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Whats For Dinner 🍽️</h1>
      <ul>
        <li><Link to="/search">Search for products</Link></li>
      </ul>
    </div>
  )
}

export default Home