/**
 * This component visualizes the eco-score distribution of products.
 * It fetches product data from an API and displays a dashboard and scatter plot.
 *
 * @component Visualize
 * @author Beatriz Sanssi
 */
import { useState, useEffect, Suspense, lazy, useMemo } from 'react'
import Dashboard from '../visualization/Dashboard'
import { apiFetch } from '../../utils/apiFetch'
import { Product } from '../interface/Product'
import { Nutrition } from '../interface/Nutrition'
import '../../App.css'

interface ProductExt extends Product {
  nutrition?: Nutrition
  eco_score?: { score: number; grade: string }
}

const EcoScatter = lazy(() => import('../visualization/EcoScatter'))
const NutritionRadar = lazy(() => import('../visualization/NutritionRadar'))
const OriginMap = lazy(() => import('../visualization/WorldMap'))

export default function Visualize() {
  const [ecoFilter, setEcoFilter] = useState<string[]>([])
  const [showRadar, setShowRadar] = useState(false)
  const [products, setProducts] = useState<ProductExt[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const json = await apiFetch<ProductExt[]>(
          `${import.meta.env.VITE_API_BASE_URL}/products?per_page=5000`,
        )
       const list = Array.isArray(json) ? json : []
          setProducts(list as ProductExt[])
        } catch (err) {
          console.error(err)
        }
      })()
    }, [])

  const avgNutrition = useMemo(() => {
    if (products.length === 0) return null
    const sums = products.reduce(
      (acc, p) => {
        if (!p.nutrition) return acc
        Object.entries(p.nutrition).forEach(([k, v]) => {
          acc[k as keyof Nutrition] += Number(v) || 0
        })
        return acc
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        salt: 0,
        saturated_fat: 0,
        cholesterol: 0,
        sodium: 0,
      } as Nutrition,
    )

    const n = products.filter((p) => p.nutrition).length || 1
    Object.keys(sums).forEach((k) => {
      sums[k as keyof Nutrition] /= n
    })
    return sums
  }, [products])

  // Checkbox toggle
  function toggleGrade(g: string) {
    setEcoFilter((f) => (f.includes(g) ? f.filter((x) => x !== g) : [...f, g]))
  }

  const filtered = products.filter(
    (p) =>
      ecoFilter.length === 0 ||
      ecoFilter.includes(p.eco_score?.grade?.toUpperCase() ?? ''),
  )

  // const total = products.length
  // const shown = filtered.length

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Eco-score distribution</h2>

      {/* ---------------- filter-controller ---------------- */}
      <div style={styles.filter}>
        {['A', 'B', 'C', 'D', 'E'].map((g) => (
          <label key={g} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              checked={ecoFilter.includes(g)}
              onChange={() => toggleGrade(g)}
            />
            {g}
          </label>
        ))}
      </div>

      <p style={styles.totalProducts}>
        {/* Showing {shown} of {total} products */}
      </p>

      <div className="visualize-grid" style={styles.grid}>
        <div style={styles.chartBox}>
          <Dashboard ecoFilter={ecoFilter} />
        </div>

        <Suspense fallback={<p>Loading scatter …</p>}>
          <div style={styles.chartBox}>
            <EcoScatter products={filtered} />
          </div>
        </Suspense>

        {showRadar && avgNutrition && (
          <Suspense fallback={<p>Loading radar …</p>}>
            <div style={styles.chartBox}>
              <NutritionRadar nutr={avgNutrition} title="Average values" />
              {/* <NutritionRadar nutr={avgNutrition} title="Average nutrition values" count={products.filter(p => p.nutrition).length} />             */}
            </div>
          </Suspense>
        )}

        <div className="chart-box-map" style={styles.chartBox}>
          <OriginMap />
        </div>
      </div>

      <button style={styles.btn} onClick={() => setShowRadar((p) => !p)}>
        {showRadar ? 'Hide' : 'Show'} radar
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '1600px',
    width: '100%',
    margin: '20px',
    gap: '20px',
    justifyContent: 'center',
  },
  totalProducts: {
    alignSelf: 'flex-start',
    margin: '10px',
    color: '#f5f5dc',
    fontSize: '20px',
  },
  title: {
    margin: '10px',
    padding: '10px',
  },
  filter: {
    marginBottom: '16px',
    display: 'flex',
    gap: '12px',
  },
  grid: {
    display: 'grid',
    // gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
    gridAutoRows: '600px',
    width: '100%',
    alignItems: 'stretch',
    justifyItems: 'center',
    boxSizing: 'border-box',
  },
  chartBox: {
    color: '#f5f5dc',
    width: '100%',
    maxHeight: '600px',
    height: '100%',
    padding: '10px',
    backgroundColor: '#f5f5dc',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  chartBoxMap: {
    color: '#f5f5dc',
    width: 'auto',
    // maxHeight: '1000px',
    // height: '100%',
    padding: '10px',
    backgroundColor: '#f5f5dc',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gridColumn: '1 / -1',
    // minHeight: '600px',
  },
  btn: {
    marginTop: '24px',
    padding: '8px 16px',
    alignSelf: 'flex-start',
  },
} as const
