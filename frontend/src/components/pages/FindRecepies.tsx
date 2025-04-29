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

interface RecipeItem extends Product {
  quantity: number
  unit: string
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
  const [results, setResults] = useState<EmbeddingMatch[]>([]) 
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState<string>('st')

  /**
   * Handles the selection of products.
   *
   * @param {Product} product - The selected product.
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
    setUnit('st')
  }

  /**
   * Handles the addition of selected products to the recipe items.
   */
  const handleAddSelectedProduct = () => {
    if (selectedProduct) {
      if (!recipeItems.some(p => p._id === selectedProduct._id)) {
        setRecipeItems(prev => [
          ...prev,
          { ...selectedProduct, quantity, unit }
        ])
        setSelectedProduct(null)
      } else {
        alert('Product already added!')
      }
    }
  }

  // /**
  //  * Searches for recipes based on the selected products.
  //  * 
  //  * @returns {Promise<void>}
  //  */
  // const searchBasedOnProducts = async () => {
  //   if (recipeItems.length === 0) {
  //     alert('You must select at least one product.')
  //     return
  //   }
    
  //   const results: EmbeddingMatch[] = []
    
  //   for (const item of recipeItems) {
  //     const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/embeddings/search`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ query: item.product_name })
  //     })
  //     const data = await res.json()
  //     if (!Array.isArray(data)) {
  //       console.error('Unexpected response from embedding search:', data)
  //       alert('Could not search for recipes. Check console for details.')
  //       return
  //     }
  //     results.push(...data)
  //   }
    
  //   setResults(results)
  // }

  const handleGenerateRecipe = async () => {
    if (recipeItems.length === 0) {
      alert('You must select at least one product.')
      return
    }
  
    try {
      const searchResults: EmbeddingMatch[] = []
  
      for (const item of recipeItems) {
        const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/embeddings/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: item.product_name })
        })
        const data = await res.json()
        if (!Array.isArray(data)) {
          console.error('Unexpected embedding result:', data)
          alert('Embedding search failed.')
          return
        }
        searchResults.push(...data)
      }
  
      setResults(searchResults) // visa dem om du vill
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/recipes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hitIds: recipeItems.map(item => item._id),
          prompt: ''
        })
      })
  
      const data = await res.json()
      console.log('Generated recipe:', data)
      alert(data.recipe)
  
    } catch (error) {
      console.error('Error generating recipe:', error)
      alert('Something went wrong when generating the recipe.')
    }
  }

  /**
   * Handles the removal of a product from the shopping list.
   *
   * @param {string} productId - The ID of the product to be removed
   * @returns {void}
   */
   const handleRemoveProduct = (productId: string) => {
    setRecipeItems((prev) => prev.filter((item) => item._id !== productId))
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
      </div>
      <h1>Find Recipes by Your Products</h1>
      {selectedProduct && (
        <div style={styles.selectedBox}>
          <h3>Selected product: {selectedProduct.product_name}</h3>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            style={styles.input}
          />
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            style={styles.input}
          >
            <option value="st">st</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
          <button style={styles.button} onClick={handleAddSelectedProduct}>Add to list</button>
          <button style={styles.removeButton} onClick={() => setSelectedProduct(null)}>Cancel</button>
        </div>
        
      )}

      {/* Lista med valda produkter */}
      {recipeItems.length > 0 && (
      <div style={styles.selectedProductsContainer}>
        <h3>Selected products:</h3>
        <ul style={styles.list}>
          {recipeItems.map(product => (
            <li key={product._id} style={styles.listItem}>
              {product.product_name} - {product.quantity} {product.unit}
              <button
                style={styles.removeButton}
                onClick={() => handleRemoveProduct(product._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {recipeItems.length > 0 && (
          <button style={styles.button} onClick={handleGenerateRecipe}>
            Find Recipes
          </button>
        )}
      </div>
      )}

      {/* Sökfältet */}
      <div style={styles.searchContainer}>
        <h3>Search for products to generate recipe</h3>
        <SearchProducts
          onProductSelect={handleProductSelect}
          minimalLayout={true}
          customInputStyle={styles.searchInput}
          showSelectButton={true}
          hideSearchButton={false}
          customButtonStyle={styles.searchButton}
        />

        {/* Sökresultat */}
        <ul style={styles.grid}>
          {results.map((hit, index) => (
            <li key={`${hit.id}-${hit.score ?? '0'}-${index}`} style={styles.card}>
              {hit.metadata?.image_url && (
                <img
                  src={hit.metadata.image_url}
                  alt={hit.metadata.product_name || 'Product'}
                  style={styles.image}
                />
              )}
              <h3 style={styles.title}>{hit.metadata.product_name}</h3>
              {hit.metadata.brands && <p style={styles.subtitle}>{hit.metadata.brands}</p>}
              {hit.metadata.categories && (
                <p style={styles.categories}>⚬ {hit.metadata.categories.join(', ')}</p>
              )}
              <p style={styles.score}>
                Score: {typeof hit.score === 'number' ? hit.score.toFixed(3) : 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'rgba(232, 222, 212)',
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
    color: '#2f4f4f',
  },
  header: {
    backgroundImage: `url(${recipe})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: 'rgba(232, 222, 212)',
    padding: '10px',
    margin: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    height: '100%',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '200px',
    opacity: 0.9,
    fontSize: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBox: {
    backgroundColor: '#eee',
    padding: '10px',
    borderRadius: '8px',
    margin: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    width: '100%',
  },
  searchContainer: {
    backgroundColor: 'rgba(245, 232, 215)',
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
    width: '300px',
    maxWidth: '100%',
    padding: '8px',
    fontSize: '16px',
    margin: '10px',
  },
  selectedProductsContainer: {
    backgroundColor: 'rgba(232, 222, 212)',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px',
    width: '80%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
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
  removeButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    marginLeft: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  list: {
    listStyleType: 'none',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    gap: '10px',
    maxWidth: '400px',
  },
  listItem: {
    color: '#2f4f4f',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '10px',
    fontWeight: 'bold',
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
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
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
  searchButton: {
    width: '100%',
    maxWidth: '100px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#2f4f4f',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    maxWidth: '100%',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
    margin: '10px',
    flex: 1,
  },
} as const