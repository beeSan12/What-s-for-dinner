/**
 * This component allows users to search for products by name.
 * It fetches data from the backend API and displays the results.
 * 
 * @component SearchProducts
 * @author Beatriz Sanssi
 */

import React, { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import { LuArrowBigRight, LuArrowBigLeft } from "react-icons/lu"

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
  minimalLayout?: boolean
}

/**
 * SearchProducts component
 */
const SearchProducts: React.FC<Props> = ({
  onProductSelect,
  maxResults,
  currentPage,
  setCurrentPage,
  minimalLayout
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [internalPage, setInternalPage] = useState(0)

  const activePage = currentPage ?? internalPage
  const updatePage = setCurrentPage ?? setInternalPage 

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
    <div style={minimalLayout ? undefined : styles.container}>
      <input
        type="text"
        placeholder="Enter product name (e.g. coffee)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={minimalLayout ? undefined : styles.input}
      />
      <button
        onClick={handleSearch}
        style={minimalLayout ? undefined : styles.searchBtn}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}

      <ul style={minimalLayout ? undefined : styles.resultList}>
        {(maxResults
          ? results.slice(activePage * maxResults, (activePage + 1) * maxResults)
          : results
        ).map((product) => (
          <li key={product._id} style={minimalLayout ? styles.compactTextStyle : styles.productItem}>
            <strong style={minimalLayout ? styles.compactTextStyle : undefined}>
              {product.product_name}
            </strong><br />
            <em style={minimalLayout ? styles.compactTextStyle : undefined}>Brand:</em>{' '}
            <span style={minimalLayout ? styles.compactTextStyle : undefined}>{product.brands}</span><br />
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name}
                style={minimalLayout ? styles.compactImageStyle : styles.productImage}
              />
            )}
            <br />
            <em style={minimalLayout ? styles.compactTextStyle : undefined}>Source:</em>{' '}
            {product.source === 'custom' ? 'Your product' : 'Global'}<br />
            <button onClick={() => onProductSelect?.(product)}>Add to list</button>
          </li>
        ))}
      </ul>

      {maxResults && results.length > maxResults && (
        <div style={minimalLayout ? undefined : styles.paginationContainer}>
          <button
           onClick={() => updatePage((prev: number) => Math.max(prev - 1, 0))}
            disabled={activePage === 0}
            style={minimalLayout ? undefined : styles.paginationBtn}
          >
            <LuArrowBigLeft /> Prev
          </button>
          <button
            onClick={() => updatePage((prev: number) =>
              (prev + 1) * maxResults! < results.length ? prev + 1 : prev
            )}
            disabled={(activePage + 1) * maxResults >= results.length}
            style={minimalLayout ? undefined : styles.paginationBtn}
          >
            Next <LuArrowBigRight />
          </button>
        </div>
      )}

       {!loading && searched && results.length === 0 && query.trim() && (
        <div style={minimalLayout ? undefined : styles.customProductBox}>
          <p>No product found. Add custom product:</p>
          {!showCustomProductForm ? (
            <button onClick={() => setShowCustomProductForm(true)}>Add “{query}”</button>
          ) : (
            <div style={minimalLayout ? undefined : styles.customForm}>
              <input placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} style={minimalLayout ? undefined : styles.customInput} />
              <input placeholder="Brand" value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} style={minimalLayout ? undefined : styles.customInput} />
              <input placeholder="Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={minimalLayout ? undefined : styles.customInput} />
              <input placeholder="Image URL (optional)" value={customImageUrl} onChange={(e) => setCustomImageUrl(e.target.value)} style={minimalLayout ? styles.compactImageStyle : styles.customInput} />
              <button onClick={handleAddCustomProduct}>Submit Product</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    display: 'block',
    padding: '20px',
    alignItems: 'flex-start',
    // padding: '20px',
    // display: 'flex',
    // flexDirection: 'row', 
    // justifyContent: 'center',
    // alignItems: 'center',
    // gap: '20px',
  },
  input: {
    padding: '0.5rem',
    width: '300px'
  },
  searchBtn: {
    marginLeft: '1rem',
    marginTop: '1rem',
    padding: '0.5rem 1rem'
  },
  resultList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '1.5rem'
  },
  productItem: {
    marginBottom: '1rem',
    borderBottom: '1px solid #ccc',
    paddingBottom: '1rem',
    color: '#2f4f4f'
  },
  productImage: {
    height: '80px',
    marginTop: '0.5rem'
  },
  paginationContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
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
  },
  customProductBox: {
    marginTop: '2rem',
    color: '#2f4f4f',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  customForm: {
    marginTop: '1rem'
  },
  customInput: {
    display: 'block',
    marginBottom: '0.5rem',
    padding: '0.3rem'
  },
  compactImageStyle: {
    height: '60px',
    maxWidth: '100px',
    objectFit: 'contain',
  },
  compactTextStyle: {
    fontSize: '14px',
    color: '#2f4f4f',
    lineHeight: '1.3',
  },
} as const


export default SearchProducts