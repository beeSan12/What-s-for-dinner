/**
 * This component allows users to search for products by name.
 * It fetches data from the backend API and displays the results.
 *
 * @component SearchProducts
 * @author Beatriz Sanssi
 */

import React, { useState, useEffect } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import { LuArrowBigRight, LuArrowBigLeft } from 'react-icons/lu'
import { MdClose } from 'react-icons/md'
import { FiLoader } from 'react-icons/fi'
import { Product } from '../interface/Product'
import { Nutrition } from '../interface/Nutrition'

interface ProductWithNutrition extends Product {
  nutrition?: Nutrition
  allergens?: Product['allergens']
}

export interface IngredientsResponse {
  ingredients_text: string
}

export interface AllergensResponse {
  allergens: Product['allergens']
}
export interface ProductListResponse {
  data: ProductWithNutrition[]
  pagination?: { totalPages?: number; totalCount?: number }
}

export interface EcoScoreResponse {
  eco_score: {
    score: number
    grade: string
  }
}

export interface NutritionResponse {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  salt: number
  saturated_fat: number
  cholesterol: number
  sodium: number
}

interface Props {
  onProductSelect: (product: ProductWithNutrition) => void
  maxResults?: number // Optional prop to limit the number of results displayed
  currentPage?: number // Optional prop for pagination
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>> // Optional prop for pagination
  minimalLayout?: boolean
  showSelectButton?: boolean // Optional prop to show select button
  hideSearchButton?: boolean
  customInputStyle?: React.CSSProperties
  customButtonStyle?: React.CSSProperties
  ecoScoreFilter?: string[]
  showFilters?: boolean
  excludedAllergens?: string[]
}

/**
 * SearchProducts component
 */
const SearchProducts: React.FC<Props> = ({
  onProductSelect,
  maxResults,
  currentPage,
  setCurrentPage,
  minimalLayout,
  showSelectButton,
  hideSearchButton,
  customInputStyle,
  customButtonStyle,
  ecoScoreFilter,
  showFilters,
  excludedAllergens,
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductWithNutrition[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [internalPage, setInternalPage] = useState(0)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  const [totalPages, setTotalPages] = useState(1)
  const activePage = currentPage ?? internalPage
  const updatePage = setCurrentPage ?? setInternalPage

  // State for custom product form
  const [showCustomProductForm, setShowCustomProductForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [customImageUrl, setCustomImageUrl] = useState('')

  // State for filters
  const effectiveEcoScoreFilter = ecoScoreFilter ?? []
  const useFilters = showFilters ?? false

  // State for caching nutrition, allergens, and ingredients
  const [nutritionCache, setNutritionCache] = useState<
    Record<string, Nutrition>
  >(() => {
    const saved = localStorage.getItem('nutritionCache')
    return saved ? JSON.parse(saved) : {}
  })

  const [allergenCache, setAllergenCache] = useState<
    Record<string, Product['allergens']>
  >(() => {
    const saved = localStorage.getItem('allergenCache')
    return saved ? JSON.parse(saved) : {}
  })

  const [ingredientCache, setIngredientCache] = useState<
    Record<string, string>
  >(() => {
    const saved = localStorage.getItem('ingredientCache')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    if (searched) handleSearch(activePage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage])

  /**
   * Handles the search action when the user clicks the search button or presses Enter.
   * It fetches product data from the backend API based on the user's query.
   */
  const handleSearch = async (page = 0) => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/products/search`
      const params = new URLSearchParams()
      params.append('page', String((currentPage ?? 0) + 1))
      params.append('per_page', String(maxResults ?? 20))

      params.append('name', query)
      params.append('page', String(page + 1))

      if (useFilters) {
        if (ecoScoreFilter && ecoScoreFilter.length > 0) {
          params.append('ecoGrades', ecoScoreFilter.join(','))
        }

        if (excludedAllergens && excludedAllergens.length > 0) {
          params.append('excludeAllergens', excludedAllergens.join(','))
        }
      }

      const url = `${baseUrl}?${params.toString()}`
      const data = await apiFetch<ProductListResponse>(url)
      setTotalPages(
        (data.pagination?.totalPages ??
          Math.ceil(
            (data.pagination?.totalCount ?? data.data?.length ?? 0) /
              (maxResults ?? 20),
          )) ||
          1,
      )
      const rawProducts: ProductWithNutrition[] = data.data || []

      // Enrich with eco_score
      const enrichedProducts = await Promise.all(
        rawProducts.map(async (product) => {
          try {
            const ecoData = await apiFetch<EcoScoreResponse>(
              `${import.meta.env.VITE_API_BASE_URL}/products/${product.barcode}/eco-score`,
            )
            product.eco_score = ecoData.eco_score
          } catch (err: unknown) {
            if (err instanceof Error && err.message.includes('404')) {
              // Eco score not found
              product.eco_score = { score: -1, grade: 'unknown' }
            } else {
              // Log all other errors (e.g. 429)
              throw err
            }
          }

          return product
        }),
      )

      console.log('Filtered & enriched products:', enrichedProducts)
      setResults(enrichedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Enriches the product with additional data such as nutrition and ingredients.
   *
   * @param product - The product object to enrich.
   * @returns {Promise<ProductWithNutrition>} - The enriched product object.
   */
  const enrichProduct = async (
    product: Product,
  ): Promise<ProductWithNutrition> => {
    let nutrition = nutritionCache[product.barcode]
    let allergens = allergenCache[product.barcode]
    let ingredients_text = ingredientCache[product.barcode]

    if (!nutrition || !ingredients_text || !allergens) {
      try {
        const [nutritionRes, ingredientsRes, allergensRes] = await Promise.all([
          !nutrition
            ? apiFetch<NutritionResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/food/${product.barcode}/nutrition`,
              )
            : null,
          !ingredients_text
            ? apiFetch<IngredientsResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/products/${product.barcode}/ingredients`,
              )
            : null,
          !allergens
            ? apiFetch<AllergensResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/products/${product.barcode}/allergens`,
              )
            : null,
        ])

        if (nutritionRes) {
          const data = nutritionRes
          nutrition = {
            calories: Number(data.calories),
            protein: Number(data.protein),
            carbs: Number(data.carbs),
            fat: Number(data.fat),
            fiber: Number(data.fiber),
            sugar: Number(data.sugar),
            salt: Number(data.salt),
            saturated_fat: Number(data.saturated_fat),
            cholesterol: Number(data.cholesterol),
            sodium: Number(data.sodium),
          }
          setNutritionCache((prev) => {
            const updated = { ...prev, [product.barcode]: nutrition! }
            localStorage.setItem('nutritionCache', JSON.stringify(updated))
            return updated
          })
        }

        if (ingredientsRes) {
          const data = ingredientsRes
          ingredients_text = data.ingredients_text
          setIngredientCache((prev) => {
            const updated = { ...prev, [product.barcode]: ingredients_text! }
            localStorage.setItem('ingredientCache', JSON.stringify(updated))
            return updated
          })
        }

        if (allergensRes) {
          const data = allergensRes
          allergens = data.allergens
          setAllergenCache((prev) => {
            const updated = { ...prev, [product.barcode]: allergens! }
            localStorage.setItem('allergenCache', JSON.stringify(updated))
            return updated
          })
        }
      } catch (err) {
        console.warn(`Failed to enrich product: ${product.product_name}`, err)
      }
    }

    return { ...product, nutrition, ingredients_text }
  }

  /**
   * This function handles the selection of a product.
   * It fetches additional data (nutrition and allergens) based on the product's barcode.
   *
   * @param product - The selected product object.
   * @returns {Promise<void>} - A promise that resolves when the product is selected.
   */
  const handleSelect = async (product: Product) => {
    const enriched = await enrichProduct(product)
    onProductSelect(enriched)
  }

  /**
   * Handles the addition of a custom product.
   * It sends a POST request to the backend API with the custom product details.
   */
  const handleAddCustomProduct = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await apiFetch<Response>(
        `${import.meta.env.VITE_API_BASE_URL}/products/custom`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_name: customName || query,
            brands: customBrand,
            categories: customCategory,
            image_url: customImageUrl || undefined,
          }),
        },
      )

      if (res.ok) {
        const saved = await res.json()
        alert(`“${saved.product_name}” added to database!`)

        // Update the results with the new custom product
        setResults((prev) => [...prev, saved])

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
   * Filters the results based on ecoScoreFilter and excludedAllergens.
   * If showFilters is false, it returns the original results.
   *
   * @param product - The selected product object.
   */
  const filteredResults = useFilters
    ? results.filter((product) => {
        const ecoGrade = product.eco_score?.grade?.toUpperCase()

        const matchesEco =
          effectiveEcoScoreFilter.length === 0 ||
          (ecoGrade &&
            ecoGrade !== 'UNKNOWN' &&
            ecoGrade !== 'NOT-APPLICABLE' &&
            effectiveEcoScoreFilter.includes(ecoGrade))

        return matchesEco
      })
    : results

  /**
   * Slices the filtered results based on the current page and maxResults.
   *
   * @returns {ProductWithNutrition[]} - The sliced array of products.
   */
  const sliceFilteredResults: ProductWithNutrition[] = maxResults
    ? (useFilters ? filteredResults : results).slice(
        activePage * (maxResults ?? 20),
        (activePage + 1) * (maxResults ?? 20),
      )
    : useFilters
      ? filteredResults
      : results

  // Visual effect for loading spinner
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div style={minimalLayout ? undefined : styles.container}>
      <input
        type="text"
        placeholder="Enter product name (e.g. coffee)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            updatePage(0)
            handleSearch(0)
          }
        }}
        style={customInputStyle || (minimalLayout ? undefined : styles.input)}
      />
      {!hideSearchButton && (
        <button
          onClick={() => {
            updatePage(0)
            handleSearch(0)
          }}
          style={
            customButtonStyle || (minimalLayout ? undefined : styles.searchBtn)
          }
        >
          Search
        </button>
      )}

      {loading ? (
        <div style={styles.loading}>
          <FiLoader style={styles.spinnerIcon} />
          <span>Loading results...</span>
        </div>
      ) : (
        <div style={minimalLayout ? undefined : styles.resultList}>
          {sliceFilteredResults.map((product) => (
            <div
              key={product._id}
              style={
                minimalLayout ? styles.compactTextStyle : styles.productItem
              }
            >
              <div style={styles.productInfo}>
                <div style={styles.productDetails}>
                  <div>
                    <strong>{product.product_name}</strong>
                  </div>
                  <div style={styles.inlineText}>
                    <em>Brand:</em> <span>{product.brands}</span>
                  </div>
                  <div style={styles.inlineText}>
                    <em>Source:</em>{' '}
                    {product.source === 'custom' ? 'Your product' : 'Global'}
                  </div>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      style={
                        minimalLayout
                          ? styles.compactImageStyle
                          : styles.productImage
                      }
                      onClick={() =>
                        setEnlargedImage(product.image_url || null)
                      }
                    />
                  )}
                  <br />
                </div>
                {enlargedImage && (
                  <div
                    style={styles.overlay}
                    onClick={() => setEnlargedImage(null)}
                  >
                    <div
                      style={styles.closeButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        setEnlargedImage(null)
                      }}
                    >
                      <MdClose />
                    </div>
                    <img
                      src={enlargedImage}
                      alt="Enlarged product"
                      style={styles.enlargedImage}
                    />
                  </div>
                )}
                {product.barcode && (
                  <div style={styles.inlineText}>
                    <em>Barcode:</em> <span>{product.barcode}</span>
                  </div>
                )}
                {showSelectButton && (
                  <button
                    onClick={() => handleSelect(product)}
                    style={styles.selectButton}
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={minimalLayout ? undefined : styles.paginationContainer}>
          <button
            onClick={() => updatePage((p) => Math.max(p - 1, 0))}
            disabled={activePage === 0}
            style={styles.paginationBtn}
          >
            <LuArrowBigLeft /> Prev
          </button>

          <button
            onClick={() => updatePage((p) => (p + 1 < totalPages ? p + 1 : p))}
            disabled={activePage + 1 >= totalPages}
            style={styles.paginationBtn}
          >
            Next <LuArrowBigRight />
          </button>
        </div>
      )}

      {!loading && searched && query.trim() && (
        <>
          <div style={minimalLayout ? undefined : styles.loading}>
            <span>
              {results.length === 0
                ? `No results found for “${query}”`
                : `Found ${results.length} results for “${query}”`}
            </span>
          </div>

          {results.length === 0 && (
            <div style={minimalLayout ? undefined : styles.customProductBox}>
              <p>No product found. Add custom product:</p>
              {!showCustomProductForm ? (
                <button onClick={() => setShowCustomProductForm(true)}>
                  Add “{query}”
                </button>
              ) : (
                <div style={minimalLayout ? undefined : styles.customForm}>
                  <input
                    placeholder="Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={minimalLayout ? undefined : styles.customInput}
                  />
                  <input
                    placeholder="Brand"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    style={minimalLayout ? undefined : styles.customInput}
                  />
                  <input
                    placeholder="Category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    style={minimalLayout ? undefined : styles.customInput}
                  />
                  <input
                    placeholder="Image URL (optional)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    style={
                      minimalLayout
                        ? styles.compactImageStyle
                        : styles.customInput
                    }
                  />
                  <button onClick={handleAddCustomProduct}>
                    Submit Product
                  </button>
                </div>
              )}
            </div>
          )}

          {results.length > 0 &&
            sliceFilteredResults.length === 0 &&
            useFilters && (
              <div style={minimalLayout ? undefined : styles.customProductBox}>
                <p>No products match your filters.</p>
              </div>
            )}
        </>
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
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ccc',
    padding: '15px',
    flexWrap: 'wrap', // ny!
    gap: '10px',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // borderBottom: '1px solid #ccc',
    // padding: '15px',
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
    // width: '300px',
    maxWidth: '300px',
  },
  searchBtn: {
    marginLeft: '1rem',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
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
    color: '#2f4f4f',
  },
  productImage: {
    height: '80px',
    marginTop: '0.5rem',
  },
  paginationContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: '1rem',
    padding: '10px',
    width: '100%',
    maxWidth: '400px', // Lägg till en rimlig maxbredd
    marginInline: 'auto'
  },
  paginationBtn: {
    backgroundColor: '#2f4f4f',
    color: 'white',
    padding: '0.75rem 1.25rem',
    fontSize: '16px',
    touchAction: 'manipulation',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: '1 1 0', // Gör dem flexibla
    minWidth: '100px', // Minimum så att de inte kollapsar
    maxWidth: '160px',
    // flex: 'none', 
    // margin: '0',
    // minWidth: '80px',
    justifyContent: 'center',
  },
  customProductBox: {
    marginTop: '2rem',
    color: '#2f4f4f',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  customForm: {
    marginTop: '1rem',
  },
  customInput: {
    display: 'block',
    marginBottom: '0.5rem',
    padding: '0.3rem',
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
    maxWidth: '80%',
    maxHeight: '80%',
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
  },
  loading: {
    marginTop: '2rem',
    fontSize: '1.2rem',
    color: '#2f4f4f',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinnerIcon: {
    animation: 'spin 1s linear infinite',
  },
} as const

export default SearchProducts
