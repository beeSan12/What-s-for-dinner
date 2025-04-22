/**
 * This component allows users to search for products by name.
 * It fetches data from the backend API and displays the results.
 * 
 * @component SearchProducts
 * @author Beatriz Sanssi
 */

import React, { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import { LuArrowBigRight, LuArrowBigLeft } from "react-icons/lu";

interface Product {
  _id: string
  product_name: string
  brands: string
  categories?: string
  image_url?: string
  source: 'custom' | 'global'
}

interface Props {
  onProductSelect?: (product: Product | { custom: true; product_name: string; _id: string }) => void
  maxResults?: number // Optional prop to limit the number of results displayed
  currentPage?: number // Optional prop for pagination
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>> // Optional prop for pagination
}

/**
 * SearchProducts component
 */
const SearchProducts: React.FC<Props> = ({onProductSelect, maxResults}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // State for pagination

  // State for custom product form
  const [showCustomProductForm, setShowCustomProductForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [customImageUrl, setCustomImageUrl] = useState('')

  /**
   * Handles the search action when the user clicks the search button or presses Enter.
   * It fetches product data from the backend API based on the user's query.
   */
  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/products/search?name=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.data || []) // Ensure data is an array
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles the addition of a custom product.
   * It sends a POST request to the backend API with the custom product details.
   */
  const handleAddCustomProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/products/custom`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: query,
          brands: customBrand,
          categories: customCategory,
          image_url: customImageUrl || undefined
        })
      })

      if (res.ok) {
        const saved = await res.json()
        alert(`“${saved.product_name}” added to database! ✅`)

        // Reset form
        setShowCustomProductForm(false)
        setCustomBrand('')
        setCustomCategory('')
        setCustomImageUrl('')
      } else {
        alert('Something went wrong when saving the custom product.')
      }
    } catch (err) {
      console.error(err)
      alert('Error adding product.')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* <h1>Search Products</h1> */}
      <input
        type="text"
        placeholder="Enter product name (e.g. coffee)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{ padding: '0.5rem', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', marginTop: '1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
      {(maxResults && currentPage !== undefined
        ? results.slice(currentPage * maxResults, (currentPage + 1) * maxResults)
        : results
      ).map((product) => (
          <li key={product._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', color: '#2f4f4f' }}>
            <strong>{product.product_name}</strong> <br />
            <em>Brand:</em> {product.brands} <br />
            {product.image_url && (
              <img src={product.image_url} alt={product.product_name} style={{ height: '80px', marginTop: '0.5rem' }} />
            )}
            <br />
            <em>Source:</em> {product.source === 'custom' ? 'Your product' : 'Global'} <br />
            <button onClick={() => onProductSelect?.(product)}>
              Add to list
            </button>
          </li>
        ))}
      </ul>

      {maxResults && results.length > maxResults && currentPage !== undefined && setCurrentPage && (
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            style={styles.paginationBtn}
          >
            <LuArrowBigLeft style={{ marginRight: '0.5rem' }} />
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * maxResults >= results.length}
            style={styles.paginationBtn}
          >
            Next
            <LuArrowBigRight style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      )}

      {!loading && searched && results.length === 0 && query.trim() && (
        <div style={{ marginTop: '2rem' }}>
          <p>No product found. Add custom product:</p>
          {!showCustomProductForm ? (
            <button onClick={() => setShowCustomProductForm(true)}>Add “{query}”</button>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <input
                placeholder="Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{ display: 'block', marginBottom: '0.5rem', padding: '0.3rem' }}
              />
              <input
                placeholder="Brand"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                style={{ display: 'block', marginBottom: '0.5rem', padding: '0.3rem' }}
              />
              <input
                placeholder="Category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                style={{ display: 'block', marginBottom: '0.5rem', padding: '0.3rem' }}
              />
              <input
                placeholder="Image URL (optional)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                style={{ display: 'block', marginBottom: '0.5rem', padding: '0.3rem' }}
              />
              <button onClick={handleAddCustomProduct}>Submit Product</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  paginationBtn: {
    backgroundColor: "#2f4f4f",
    color: "white",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: '20px',
  }
}

export default SearchProducts