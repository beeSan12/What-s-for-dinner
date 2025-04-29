/**
 * This component serves as the landing page for the application.
 * It provides links to various functionalities of the app.
 * @author Beatriz Sanssi
 * @component Home
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { MdFoodBank } from 'react-icons/md'
import { TbWorldQuestion } from 'react-icons/tb'
import { ImSearch } from 'react-icons/im'
import pizza from '../../images/pizza.jpg'
import Header from '../../images/Header.png'

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <img
        src={Header}
        alt="Header"
        style={{ width: '50%', height: 'auto', margin: '20px' }}
      />
      <div style={styles.cardContainer}>
        <Link to="/search" style={styles.card}>
          <h2>Search Products</h2>
          <p>Find products from our database.</p>
          <ImSearch size="30px" />
        </Link>
        <Link to="/find-recipe" style={styles.card}>
          <h2>Find Recipes</h2>
          <p>Discover recipes based on selected products.</p>
          <MdFoodBank size="30px" />
        </Link>
        <Link to="/search-query" style={styles.card}>
          <h2>Ask a Question</h2>
          <p>Ask about products, allergies, or more.</p>
          <TbWorldQuestion size="30px" />
        </Link>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    margin: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${pizza})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  card: {
    display: 'block',
    width: '250px',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(232, 222, 212, 0.9)',
    textDecoration: 'none',
    color: '#2f4f4f',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textAlign: 'center' as const,
    fontWeight: 'bold',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
} as const

export default Home
