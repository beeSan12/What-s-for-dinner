/**
 * This component allows users to search for products by name.
 * It fetches data from the backend API and displays the results.
 * 
 * @component SearchProducts
 * @author Beatriz Sanssi
 */

import React, { useState } from 'react'

interface Product {
  _id: string
  product_name: string
  brands: string
  categories?: string
  image_url?: string
}

const SearchProducts: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)

    try {
      const response = await fetch(`/api/products/search?name=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.data || []) // eftersom vi returnerar { data, pagination } från service
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Search Products</h1>
      <input
        type="text"
        placeholder="Enter product name (e.g. coffee)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      <div style={{ marginTop: '2rem' }}>
        {results.length === 0 && !loading && <p>No results yet. Try searching!</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((product) => (
            <li key={product._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <strong>{product.product_name}</strong> <br />
              <em>Brand:</em> {product.brands} <br />
              {product.image_url && <img src={product.image_url} alt={product.product_name} style={{ height: '100px', marginTop: '0.5rem' }} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SearchProducts