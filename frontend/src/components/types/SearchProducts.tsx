/**
 * This component allows users to search for products by name.
 * It fetches data from the backend API and displays the results.
 * 
 * @component SearchProducts
 * @author Beatriz Sanssi
 */

import React, { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import { LuArrowBigRight, LuArrowBigLeft } from 'react-icons/lu'
import { MdClose } from 'react-icons/md'

interface Product {
  _id: string
  product_name: string
  brands: string
  categories?: string
  image_url?: string
  source: 'custom' | 'global'
}

interface Props {
  onProductSelect: (product: Product) => void
  // onResults: (products: Product[]) => void
  // onProductSelect?: (product: Product | { custom: true; product_name: string; _id: string }) => void
  maxResults?: number // Optional prop to limit the number of results displayed
  currentPage?: number // Optional prop for pagination
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>> // Optional prop for pagination
  minimalLayout?: boolean
  showSelectButton?: boolean // Optional prop to show select button
  hideSearchButton?: boolean 
  customInputStyle?: React.CSSProperties
  customButtonStyle?: React.CSSProperties
}

/**
 * SearchProducts component
 */
const SearchProducts: React.FC<Props> = ({
  onProductSelect,
  // onResults,
  maxResults,
  currentPage,
  setCurrentPage,
  minimalLayout,
  showSelectButton,
  hideSearchButton,
  customInputStyle,
  customButtonStyle
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [internalPage, setInternalPage] = useState(0)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

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
      console.log('Fetched products:', data)
      setResults(data.data || []) // Ensure data is an array
      // onResults(data.data || []) // Pass the results to the parent component
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
          product_name: customName || query,
          brands: customBrand,
          categories: customCategory,
          image_url: customImageUrl || undefined
        })
      })

      if (res.ok) {
        const saved = await res.json()
        alert(`“${saved.product_name}” added to database!`)

        // Update the results with the new custom product
        setResults(prev => [...prev, saved])

        // Reset form
        setShowCustomProductForm(false)
        setCustomName('')
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


  /**
   * Slices the results array based on the current page and maxResults.
   *
   * @param product - The selected product object.
   */
  const sliceResults = maxResults
    ? results.slice(activePage * maxResults, (activePage + 1) * maxResults)
    : results

  return (
    <div style={minimalLayout ? undefined : styles.container}>
      <input
        type="text"
        placeholder="Enter product name (e.g. coffee)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={customInputStyle || (minimalLayout ? undefined : styles.input)}
      />
      {!hideSearchButton && (
        <button
          onClick={handleSearch}
          style={customButtonStyle || (minimalLayout ? undefined : styles.searchBtn)}
        >
          Search
        </button>
      )}

      {loading && <p>Loading...</p>}

      {/* <ul style={minimalLayout ? undefined : styles.resultList}> */}
      <div style={minimalLayout ? undefined : styles.resultList}>
        {sliceResults.map(product => (
          <div key={product._id} style={minimalLayout ? styles.compactTextStyle : styles.productItem}>
          {/* //<li key={product._id} style={minimalLayout ? styles.compactTextStyle : styles.productItem}> */}
            <div style={styles.productInfo}>
              <div style={styles.productDetails}>
              <div>
                <strong>{product.product_name}</strong>
              </div>
              <div style={styles.inlineText}>
                <em>Brand:</em> <span>{product.brands}</span>
              </div>
              <div style={styles.inlineText}>
                <em>Source:</em> {product.source === 'custom' ? 'Your product' : 'Global'}
              </div>
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={minimalLayout ? styles.compactImageStyle : styles.productImage}
                    onClick={() => setEnlargedImage(product.image_url || null)}
                  />
                )}
                <br />
              </div>
              {enlargedImage && (
                <div style={styles.overlay} onClick={() => setEnlargedImage(null)}>
                  <div style={styles.closeButton} onClick={(e) => { e.stopPropagation(); setEnlargedImage(null); }}>
                    <MdClose />
                  </div>
                  <img src={enlargedImage} alt="Enlarged product" style={styles.enlargedImage} />
                </div>
              )}
              {showSelectButton && (
                <button onClick={() => onProductSelect(product)} style={styles.selectButton}>
                  Select
                </button>
              )}
            </div>
          </div>
        // </li>
      ))}
    </div>
    {/* </ul> */}

      {/* <ul style={minimalLayout ? undefined : styles.resultList}>
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
      </ul> */}

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
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ccc',
    padding: '15px',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    maxWidth: '70%',
  },
  selectButton: {
  backgroundColor: '#2f4f4f',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  },
  input: {
    padding: '0.5rem',
    width: '300px',
    
  },
  searchBtn: {
    marginLeft: '1rem',
    marginTop: '1rem',
    padding: '0.5rem 1rem'
  },
  resultList: {
    listStyle: 'none',
    padding: '5px',
    marginTop: '1.5rem',
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: '10px', 
    flex: 1,
    width: '100%',
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
    gap: '1rem',
    padding: '10px',
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
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer',
    backgroundColor: 'rgba(225, 225, 225, 0.6)',
  },
  enlargedImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '8px',
  },
  closeButton: {
    position: 'absolute',
    top: '40px',
    right: '40px',
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
  },
  inlineText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
} as const


export default SearchProducts