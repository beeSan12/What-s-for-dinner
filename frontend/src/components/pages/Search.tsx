/**
 * This component allows users to search for products by name.
 *
 * @component Search
 * @author Beatriz Sanssi
 */

import SearchProducts from '../types/SearchProducts'
import NutritionChart from '../types/NutritionChart'
import { useState } from 'react'
// import { apiFetch } from '../../utils/apiFetch'
import { Product } from '../interface/Product'
import { Nutrition } from '../interface/Nutrition'
import { MdClose } from 'react-icons/md'
import { EcoScoreChart } from  '../types/EcoScoreChart'


export default function Search() {
  const [selected, setSelected] = useState<Product | null>(null)
  const [nutrition, setNutrition] = useState<Nutrition | null>(null)
  const [allergens, setAllergens] = useState<Record<string, boolean> | null>(
    null,
  )
  const [ingredients, setIngredients] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingNutrition, setLoadingNutrition] = useState(false)

  function onProductSelect(
    product: Product & {
      nutrition?: Nutrition & { allergens?: Record<string, boolean> }
    },
  ) {
    console.log('Selected product:', product)
    setLoadingNutrition(true)

    if (!product.barcode) {
      setSelected(product)
      setError('Product has no barcode – cannot fetch nutrition data')
      setNutrition(null)
      setAllergens(null)
      setIngredients(null)
      return
    }

    setSelected(product)
    setError(null)

    // Display the product nutrition data
    if (product.nutrition) {
      setNutrition(product.nutrition)
      console.log('Product nutrition:', product.nutrition)
    } else {
      setNutrition(null)
      setError('No nutrition data available')
    }

    // Display the product allergens data
    if (product.allergens) {
      setAllergens(product.allergens)
      console.log('Product allergens:', product.allergens)
    } else {
      setAllergens(null)
      setError('No allergens data available')
    }

    // Display the product ingredients data
    if (product.ingredients_text && product.ingredients_text.trim()) {
      setIngredients(product.ingredients_text.trim())
      console.log('Product ingredients:', product.ingredients_text)
    } else {
      setIngredients(null)
      setError('No ingredients data available')
    }

    setLoadingNutrition(false)
  }
  //   try {
  //     const res = await apiFetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/food/${product.barcode}/nutrition`,
  //     )
  //     if (!res.ok) throw new Error('Could not fetch nutrition data')
  //     const nut: Nutrition = await res.json()
  //     setNutrition(nut)
  //   } catch (error: unknown) {
  //     console.error(error)
  //     if (error instanceof Error) {
  //       setError(error.message)
  //     } else {
  //       setError('An unknown error occurred')
  //     }
  //     setNutrition(null)
  //   }
  // }

  function handleCloseDetail() {
    setSelected(null)
    setNutrition(null)
    setError(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Search for Products</h2>

        {selected && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <button
                onClick={handleCloseDetail}
                style={styles.closeButton}
                aria-label="Close detail"
              >
                <MdClose size={24} />
              </button>

              {selected.image_url && (
                <img
                  src={selected.image_url}
                  alt={selected.product_name}
                  style={styles.detailImage}
                />
              )}

              <h3 style={styles.detailHeading}>{selected.product_name}</h3>

              {loadingNutrition && (
                <p style={styles.loadingText}>Loading nutrition data…</p>
              )}

              {error && <p style={styles.errorText}>{error}</p>}

              {nutrition && (
                <>
                <h4>Nutrition (per 100g):</h4>
                <ul>
                  <li>Calories: {nutrition.calories}</li>
                  <li>Protein: {nutrition.protein}</li>
                  <li>Fat: {nutrition.fat}</li>
                  <li>Carbs: {nutrition.carbs}</li>
                  <li>Sugars: {nutrition.sugar}</li>
                  <li>Fiber: {nutrition.fiber}</li>
                  <li>Saturated Fat: {nutrition.saturated_fat}</li>
                  <li>Salt: {nutrition.salt}</li>
                  <li>Cholesterol: {nutrition.cholesterol}</li>
                  {/* Lägg till fler om du vill */}
                </ul>
                  <NutritionChart totals={nutrition} />
                </>
              )}

                <div style={styles.productInfoBox}>
                  <h4>Product Details</h4>
                  <p>
                    <strong>Brand:</strong> {selected.brands}
                  </p>
                  <p>
                    <strong>Categories:</strong> {selected.categories || '–'}
                  </p>
                  <p>
                    <strong>Ingredients:</strong> {ingredients || 'Not available'}
                  </p>

                  <p>
                    <strong>Allergens:</strong>
                  </p>
                  <ul style={styles.allergenList}>
                    {allergens ? (
                      Object.entries(allergens).map(([key, value]) => (
                        <li
                          key={key}
                          style={
                            value === true
                              ? styles.allergenItemYes
                              : value === false
                                ? styles.allergenItemNo
                                : styles.allergenItemUnknown
                          }
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                          {value === true
                            ? 'Yes'
                            : value === false
                              ? 'No'
                              : 'Unknown'}
                        </li>
                      ))
                    ) : (
                      <li>No allergen data</li>
                    )}
                  </ul>

                    {/* EcoScore */}
                  <div style={{ marginTop: '30px' }}>
                    <EcoScoreChart
                      data={[
                        {
                          grade: selected?.eco_score?.grade || 'unknown',
                          value: selected?.eco_score?.score ?? 0,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        <SearchProducts onProductSelect={onProductSelect} showSelectButton />
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
  detail: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '2rem',
    backgroundColor: '#fff',
    position: 'relative',
  },
  detailHeading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    marginBottom: '0.5rem',
    color: '#2f4f4f',
  },
  detailImage: {
    maxWidth: '180px',
    margin: '0.5rem auto',
    display: 'block',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: '0.5rem',
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#555',
  },
  productInfoBox: {
    textAlign: 'left',
    marginTop: '1rem',
  },
  allergenList: {
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: '0.5rem',
  },
  allergenItemYes: {
    color: '#a94442',
    fontWeight: 'bold',
  },
  allergenItemNo: {
    color: '#3c763d',
  },
  allergenItemUnknown: {
    color: '#8a6d3b',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  confirmButton: {
    marginTop: '20px',
    backgroundColor: '#2f4f4f',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
} as const
