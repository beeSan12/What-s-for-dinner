/**
 * This component is used to search for recipes based on selected products or a free text query.
 *
 * @component FindRecipes
 * @author Beatriz Sanssi
 */
import { useState } from 'react'
import SearchProducts from '../types/SearchProducts'
import { apiFetch } from '../../utils/apiFetch'

interface Product {
  _id: string
  product_name: string
}

interface EmbeddingMatch extends Product {
  id: string
  metadata: {
    text: string
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

  return (
    <div>
      <h2>Find Recipes by Your Products</h2>

      <SearchProducts onProductSelect={handleProductSelect} minimalLayout={true} />

      <button onClick={searchBasedOnProducts}>Find Recipes</button>

      <ul>
        {results.map((match) => (
          <li key={match.id}>{match.metadata?.text}</li>
        ))}
      </ul>
    </div>
  )
}