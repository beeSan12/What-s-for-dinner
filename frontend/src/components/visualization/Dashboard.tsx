/**
 * This component displays a dashboard with a bar chart representing the distribution of eco-scores.
 * It fetches the data from an API endpoint and filters it based on the provided ecoFilter prop.
 *
 * @component Dashboard
 * @author Beatriz Sanssi
 */

import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { apiFetch } from '../../utils/apiFetch'

// type EcoData = { grade: string; value: number }
type Props = { ecoFilter?: string[] }

export default function Dashboard({ ecoFilter = [] }: Props) {
  const [data, setData] = useState<{ grade: string; value: number }[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/eco-score-distribution`
      )
      const json = await res.json()
      setData(Array.isArray(json) ? json : [])
    })()
  }, [])

  // Filter the data based on the ecoFilter prop
  const filtered = ecoFilter.length
    ? data.filter(d => ecoFilter.includes(d.grade.toUpperCase()))
    : data

  const option = {
    title: { text: 'Total of products', left: 'center' },
    xAxis: { type: 'category', data: filtered.map(d => d.grade.toUpperCase()) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: filtered.map(d => d.value) }],
    tooltip: {}
  }

  return <ReactECharts option={option} style={{ height: 300, width: '100%' }} />
}