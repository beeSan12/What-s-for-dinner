/**
 * This component allows users to search for products by name.
 *
 * @component Search
 * @author Beatriz Sanssi
 */

import SearchProducts from '../types/SearchProducts'
import NutritionChart from '../types/NutritionChart'
import { useState } from 'react'
import { apiFetch } from '../../utils/apiFetch'
import { Product } from '../interface/Product'
import { Nutrition } from '../interface/Nutrition'
import { MdClose } from 'react-icons/md'

export default function Search() {
  const [selected, setSelected] = useState<Product | null>(null)
  const [nutrition, setNutrition] = useState<Nutrition | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onProductSelect(product: Product) {
    console.log('Selected product:', product)

    if (!product.barcode) {
      setSelected(product)
      setError('Product has no barcode – cannot fetch nutrition data')
      setNutrition(null)
      return
    }

    setSelected(product)
    setError(null)

    try {
      const res = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/food/${product.barcode}/nutrition`,
      )
      if (!res.ok) throw new Error('Could not fetch nutrition data')
      const nut: Nutrition = await res.json()
      setNutrition(nut)
    } catch (error: unknown) {
      console.error(error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
      setNutrition(null)
    }
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
         <SearchProducts
          onProductSelect={onProductSelect}
          showSelectButton
        />

        {selected && (
          <div style={styles.detail}>
            <button
              onClick={handleCloseDetail}
              style={styles.closeButton}
              aria-label="Close detail"
            >
              <MdClose size={24} />
            </button>
            <h3>{selected.product_name}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {nutrition
              ? <NutritionChart totals={nutrition} />
              : !error && <p>Laddar näringsdata…</p>
            }
          </div>
        )}
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
    marginTop: '2rem',
    textAlign: 'center',
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
} as const
