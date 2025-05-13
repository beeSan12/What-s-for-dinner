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
import { EcoScoreChart } from '../types/EcoScoreChart'
import { Filters } from '../../utils/Filters'
import NutritionRadar from '../visualization/NutritionRadar'

/**
 * Function to get the EcoScore description based on the grade.
 *
 * @param grade The EcoScore grade (A, B, C, D, E).
 * @returns The description of the EcoScore.
 */
function getEcoScoreDescription(grade: string | undefined): string {
  switch (grade?.toLowerCase()) {
    case 'a':
      return 'Excellent – environmentally friendly product'
    case 'b':
      return 'Good – relatively low environmental impact'
    case 'c':
      return 'Moderate – average eco impact'
    case 'd':
      return 'Poor – high environmental impact'
    case 'e':
      return 'Very Poor – very high environmental impact'
    default:
      return 'Unknown or not available'
  }
}

export default function Search() {
  const [selected, setSelected] = useState<Product | null>(null)
  const [nutrition, setNutrition] = useState<Nutrition | null>(null)
  const [allergens, setAllergens] = useState<Record<string, boolean> | null>(
    null,
  )
  const [ingredients, setIngredients] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingNutrition, setLoadingNutrition] = useState(false)
  const [ecoScoreFilter, setEcoScoreFilter] = useState<string[]>([])
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

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

  function handleCloseDetail() {
    setSelected(null)
    setNutrition(null)
    setError(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Search for Products</h2>
        <button
          onClick={() => setShowFilters(prev => !prev)}
          style={styles.filterButton}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {showFilters && (
          <Filters
            ecoScoreFilter={ecoScoreFilter}
            setEcoScoreFilter={setEcoScoreFilter}
            excludedAllergens={excludedAllergens}
            setExcludedAllergens={setExcludedAllergens}
          />
        )}

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
                    <li>
                      Calories:{' '}
                      {isNaN(nutrition.calories) ? 'N/A' : nutrition.calories}
                    </li>
                    <li>
                      Protein:{' '}
                      {isNaN(nutrition.protein) ? 'N/A' : nutrition.protein}
                    </li>
                    <li>Fat: {isNaN(nutrition.fat) ? 'N/A' : nutrition.fat}</li>
                    <li>
                      Carbs: {isNaN(nutrition.carbs) ? 'N/A' : nutrition.carbs}
                    </li>
                    <li>
                      Sugars: {isNaN(nutrition.sugar) ? 'N/A' : nutrition.sugar}
                    </li>
                    <li>
                      Fiber: {isNaN(nutrition.fiber) ? 'N/A' : nutrition.fiber}
                    </li>
                    <li>
                      Saturated Fat:{' '}
                      {isNaN(nutrition.saturated_fat)
                        ? 'N/A'
                        : nutrition.saturated_fat}
                    </li>
                    <li>
                      Salt: {isNaN(nutrition.salt) ? 'N/A' : nutrition.salt}
                    </li>
                    <li>
                      Cholesterol:{' '}
                      {isNaN(nutrition.cholesterol)
                        ? 'N/A'
                        : nutrition.cholesterol}
                    </li>
                  </ul>
                  <NutritionChart totals={nutrition} />
                  <NutritionRadar nutr={nutrition} title={selected.product_name} />
                </>
              )}

              <div style={styles.productInfoBox}>
                <h3 style={styles.title}>Product Details</h3>

                {nutrition && (
                  <>
                    <h4 style={styles.sectionTitle}>Nutriments</h4>
                    <p style={styles.nutritionSummary}>
                      This product contains approximately  
                      <strong>{nutrition.calories}</strong> kcal, 
                      <strong> {nutrition.protein}</strong>g protein, 
                      <strong> {nutrition.sugar}</strong>g sugars,
                      <strong> {nutrition.fiber}</strong>g fiber,
                      <strong> {nutrition.saturated_fat}</strong>g saturated fat,
                      <strong> {nutrition.salt}</strong>g salt,
                      <strong> {nutrition.cholesterol}</strong>mg cholesterol,
                      <strong> {nutrition.sodium}</strong>mg sodium,
                      <strong> {nutrition.carbs}</strong>g carbohydrates and 
                      <strong> {nutrition.fat}</strong>g fat per 100g.
                    </p>
                  </>
                )}

                <h4 style={styles.sectionTitle}>Brand</h4>
                <p style={styles.sectionText}>{selected.brands}</p>

                <h4 style={styles.sectionTitle}>Categories</h4>
                <p style={styles.sectionText}>{selected.categories || '–'}</p>

                <h4 style={styles.sectionTitle}>Ingredients</h4>
                <p style={styles.sectionText}>{ingredients || 'Not available'}</p>

                <h4 style={styles.sectionTitle}>Allergens</h4>
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
                {selected.eco_score &&
                typeof selected.eco_score.score === 'number' &&
                selected.eco_score.score >= 0 ? (
                  <>
                    <h4>Eco Score</h4>
                    <EcoScoreChart
                      data={[
                        {
                          grade: selected.eco_score.grade || 'unknown',
                          value: selected.eco_score.score,
                        },
                      ]}
                    />
                  </>
                ) : (
                  <p style={{ color: 'red' }}>No eco score available</p>
                )}
                {selected.eco_score?.grade && (
                  <p
                    style={{
                      marginTop: '10px',
                      fontStyle: 'italic',
                      color: '#2f4f4f',
                    }}
                  >
                    Eco Score Grade{' '}
                    <strong>{selected.eco_score.grade.toUpperCase()}</strong>{' '}
                    means: {getEcoScoreDescription(selected.eco_score.grade)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <SearchProducts
          onProductSelect={onProductSelect}
          showSelectButton
          ecoScoreFilter={ecoScoreFilter}
          showFilters={showFilters}
          excludedAllergens={excludedAllergens}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          maxResults={20}
        />
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
    marginBottom: '10px',
    color: '#2f4f4f',
    alignSelf: 'center',
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
    color: '#2f4f4f',
    fontSize: '20px',
    fontWeight: 'bold',
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
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  filterButton: {
    marginTop: '20px',
    backgroundColor: '#2f4f4f',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  nutritionSummary: {
    marginTop: '1rem',
    marginBottom: '1rem',
    lineHeight: '1.5',
    fontSize: '0.95rem',
    color: '#2f4f4f',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    color: '#2f4f4f',
  },
  sectionText: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: '#2f4f4f',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#2f4f4f',
  },
} as const
