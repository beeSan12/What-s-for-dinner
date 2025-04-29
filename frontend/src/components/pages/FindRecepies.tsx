/**
 * This component is used to search for recipes based on selected products or a free text query.
 *
 * @component FindRecipes
 * @author Beatriz Sanssi
 */
import { useState } from 'react'
import SearchProducts from '../types/SearchProducts'
import { apiFetch } from '../../utils/apiFetch'
import recipe from '../../images/recipe.jpg'

interface Product {
  _id: string
  product_name: string
}

interface EmbeddingMatch extends Product {
  id: string
  score: number
  metadata: {
    product_name: string
    brands?: string
    image_url?: string
    categories?: string[]
  }
}

/**
 * This component allows users to find recipes based on selected products.
 *
 * @returns {JSX.Element} The FindRecipes component.
 */
export default function FindRecipes() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [results, setResults] = useState<EmbeddingMatch[]>([]) 

  /**
   * Handles the selection of products.
   * 
   * @param {Object}
   * @param {string} product.product_name - The name of the selected product.
   */
  const handleProductSelect = (product: { product_name: string }) => {
    setSelectedProducts(prev => [...prev, product.product_name])
  }

  /**
   * Searches for recipes based on the selected products.
   * 
   * @returns {Promise<void>}
   */
  const searchBasedOnProducts = async () => {
    const combinedQuery = selectedProducts.join(' ')
    const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/embeddings/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: combinedQuery }),
    })
    const data = await res.json()
    setResults(data)
  }

  const handleGenerateRecipe = (id: string) => {
    console.log('Generate recipe for product ID:', id)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
       <h1>Find Recipes by Your Products</h1>
      </div>
      <div style={styles.searchContainer}>
        <SearchProducts 
            onProductSelect={handleProductSelect}
            minimalLayout={true}
            customInputStyle={styles.searchInput}
            showSelectButton={false}
            hideSearchButton={true}
        />
        <button style={styles.button} onClick={searchBasedOnProducts}>Find Recipes</button>
        <ul style={styles.grid}>
          {results.map(hit => (
            <li key={hit.id} style={styles.card}>
              {hit.metadata.image_url && (
                <img
                  src={hit.metadata.image_url}
                  alt={hit.metadata.product_name}
                  style={styles.image}
                />
              )}
              <h3 style={styles.title}>{hit.metadata.product_name}</h3>
              {hit.metadata.brands && (
                <p style={styles.subtitle}>{hit.metadata.brands}</p>
              )}
              {hit.metadata.categories && (
                <p style={styles.categories}>
                  ⚬ {hit.metadata.categories.join(', ')}
                </p>
              )}
              <p style={styles.score}>Score: {hit.score.toFixed(3)}</p>
              <button
                style={styles.recipeButton}
                onClick={() => handleGenerateRecipe(hit.id)}
              >
                Generera recept
              </button>
            </li>
          ))}
        </ul>
      </div>
      </div>

      
  )
}
const styles = {
  container: {
    backgroundImage: `url(${recipe})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px',
    margin: '20px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
    gap: '30px', 
    paddingTop: '150px',
  },
  header: {
    backgroundColor: 'rgba(232, 222, 212)',
    padding: '10px',
    margin: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    width: '70%',
    maxWidth: '1000px',
    opacity: 0.9,
    fontSize: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'rgba(232, 222, 212)',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    width: '80%',
    maxWidth: '800px',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    maxWidth: '100%',
    padding: '8px',
    fontSize: '16px',
    margin: '10px',
  },
  button: {
    width: '100%',
    maxWidth: '200px',
    padding: '10px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#2f4f4f',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
  },
  listItem: {
    color: '#2f4f4f',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    listStyleType: 'none',
    padding: 0,
    margin: 0
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  image: {
    width: '100%',
    borderRadius: '4px',
    objectFit: 'cover'
  },
  title: {
    margin: 0,
    fontSize: '1.1rem'
  },
  subtitle: {
    margin: 0,
    fontStyle: 'italic',
    color: '#555'
  },
  categories: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#666'
  },
  score: {
    fontSize: '0.8rem',
    color: '#666'
  },
  recipeButton: {
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#2f4f4f',
    color: '#fff',
    cursor: 'pointer'
  },
} as const