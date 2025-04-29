/**
 * This component allows users to search for products by name.
 *
 * @component Search
 * @author Beatriz Sanssi
 */

import SearchProducts from '../types/SearchProducts'

export default function Search() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Search for Products</h2>
        <SearchProducts onProductSelect={() => {}} />
      </div>
    </div>
  )
}

const styles = {
  page: {
    backgroundColor: '#bc8f8f',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'contain',
    margin: '20px',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fefefe',
    padding: '30px',
    margin: '30px',
    marginTop: '50px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    minHeight: '300px',
    height: '90%',
    width: '90%',
    overflow: 'auto',
    opacity: 0.9,
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#2f4f4f',
  },
} as const
