/**
 * This file contains the statistics page for displaying the Eco-Score distribution.
 *
 * @file Statistics.tsx
 * @author Beatriz Sanssi
 */
import { EcoScoreChart } from '../components/types/EcoScoreChart'
import { useEffect, useState } from 'react'
import { apiFetch } from './apiFetch'

export const EcoScorePage = () => {
  const [data, setData] = useState<{ grade: string, value: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_API_BASE_URL}/statistics/eco-score-distribution`
        )
        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error('Failed to fetch eco score distribution:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Eco-Score Distribution</h2>
      <EcoScoreChart data={data} />
    </div>
  )
}