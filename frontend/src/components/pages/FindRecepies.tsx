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
import { MdClose } from 'react-icons/md'

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
  const [quantity, setQuantity] = useState<string>('1')
  const [unit, setUnit] = useState<string>('st')
  const [generatedRecipes, setGeneratedRecipes] = useState<string[]>([])
  const [addingMore, setAddingMore] = useState(false)

  /**
   * Resets the search results and clears the selected products.
   */
  const resetSearch = () => {
    setGeneratedRecipes([])
    setRecipeItems([])
    setAddingMore(false)
    setSelectedProduct(null)
  }

  /**
   * Handles the selection of products.
   *
   * @param {Product} product - The selected product.
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity('1')
    setUnit('st')
  }

  /**
   * Handles the addition of selected products to the recipe items.
   */
  const handleAddSelectedProduct = () => {
    if (selectedProduct) {
      const qty = parseInt(quantity, 10)
      if (isNaN(qty) || qty < 1) {
        alert('Add a valid quantity!')
        return
      }

      if (recipeItems.some((p) => p._id === selectedProduct._id)) {
        alert('Product already added!')
        return
      }
      if (!recipeItems.some((p) => p._id === selectedProduct._id)) {
        setRecipeItems((prev) => [
          ...prev,
          { ...selectedProduct, quantity: qty, unit },
        ])
        setSelectedProduct(null)
        setAddingMore(false)
        setQuantity('1')
      } else {
        alert('Product already added!')
      }
    }
  }

  /**
   * Searches for recipes based on the selected products.
   *
   * @returns {Promise<void>}
   */
  const searchBasedOnProducts = async () => {
    if (recipeItems.length === 0) {
      alert('You must select at least one product.')
      return
    }

    const results: EmbeddingMatch[] = []

    for (const item of recipeItems) {
      const data: EmbeddingMatch[] = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/embeddings/search`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: item.product_name }),
        },
      )
      if (!Array.isArray(data)) {
        console.error('Unexpected response from embedding search:', data)
        alert('Could not search for recipes. Check console for details.')
        return
      }
      results.push(...data)
    }

    setResults(results)
  }

  /**
   * Handles the generation of recipes based on selected products.
   */
  const handleGenerateRecipe = async () => {
    if (recipeItems.length === 0) {
      alert('You must select at least one product.')
      return
    }

    await searchBasedOnProducts()

    try {
      const data: { recipe: string } = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/recipes/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hitIds: recipeItems.map((item) => item._id),
            prompt:
              'Please provide recipes (ingredients & instructions) in English based on these ingredients.',
          }),
        },
      )

      console.log('Generated recipe:', data)

      // Add recipe to the list of generated recipes
      setGeneratedRecipes((prev) => [...prev, data.recipe])
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
      <div style={styles.header} />
      <h1 style={styles.h1}>Find Recipes by Your Products</h1>
      {/* 1) Search for product */}
      {(recipeItems.length === 0 || addingMore) &&
        !selectedProduct &&
        generatedRecipes.length === 0 && (
          <div style={styles.searchContainer}>
            <h3>Search for products to generate recipe</h3>
            <SearchProducts
              onProductSelect={handleProductSelect}
              maxResults={5}
              minimalLayout={true}
              customInputStyle={styles.searchInput}
              showSelectButton={true}
              hideSearchButton={false}
              showFilters={false}
              customButtonStyle={styles.searchButton}
            />
          </div>
        )}
      {/* 2) If a product is chosen, choose quantity */}
      {selectedProduct && (
        <div style={styles.selectedBox}>
          <h3>Selected product: {selectedProduct.product_name}</h3>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={styles.input}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={styles.input}
          >
            <option value="st">st</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
          <button style={styles.button} onClick={handleAddSelectedProduct}>
            Add to list
          </button>
          <button
            style={styles.removeButton}
            onClick={() => setSelectedProduct(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* List with chosen items */}
      {recipeItems.length > 0 && (
        <div style={styles.selectedProductsContainer}>
          <h3>Selected products:</h3>
          <ul style={styles.list}>
            {recipeItems.map((product) => (
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
            <div style={styles.selectedProductsButtons}>
              <button style={styles.button} onClick={handleGenerateRecipe}>
                Find Recipes
              </button>
              <button
                style={styles.button}
                onClick={() => {
                  setAddingMore(true)
                  setSelectedProduct(null)
                }}
              >
                Add more products
              </button>
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div style={styles.recipeCardsContainer}>
          {generatedRecipes.map((recipe, index) => (
            <div key={index} style={styles.recipeCard}>
              <button
                onClick={resetSearch}
                style={styles.closeButton}
                aria-label="Close recipe"
              >
                <MdClose />
              </button>
              <pre style={styles.recipeText}>{recipe}</pre>
              <button onClick={resetSearch} style={styles.button}>
                New Search
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'rgba(232, 222, 212)',
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    padding: '20px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    maxWidth: '100%',
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    gap: '30px',
    paddingTop: '150px',
    color: '#2f4f4f',
  },
  header: {
    backgroundImage: `url(${recipe})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    maxWidth: '1000px',
    height: '200px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
  },
  h1: {
    alignSelf: 'center',
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
    alignSelf: 'center',
  },
  selectedProductsButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '10px',
  },
  searchContainer: {
    backgroundColor: 'rgba(245, 232, 215)',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    maxWidth: '800px',
    height: '100%',
    marginTop: '20px',
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
    alignSelf: 'center',
  },
  button: {
    width: '100%',
    maxWidth: '200px',
    padding: '10px',
    margin: '10px',
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
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
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
    margin: '10px',
  },
  input: {
    width: '100%',
    maxWidth: '300px',
    padding: '10px',
    fontSize: '16px',
    margin: '10px 0',
    boxSizing: 'border-box',
  },
  recipeCardsContainer: {
    marginTop: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  recipeCard: {
    position: 'relative',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    width: '90%',
    maxWidth: '800px',
    margin: '20px',
    alignSelf: 'center',
    zIndex: 1,
  },
  recipeText: {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: '#2f4f4f',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#2f4f4f',
    zIndex: 2,
  },
} as const
