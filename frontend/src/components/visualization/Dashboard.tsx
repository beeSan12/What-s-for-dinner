/**
 * This component displays a dashboard with a bar chart representing the distribution of eco-scores.
 * It fetches the data from an API endpoint and filters it based on the provided ecoFilter prop.
 *
 * @component Dashboard
 * @author Beatriz Sanssi
 */

import { useEffect, useState, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { apiFetch } from '../../utils/apiFetch'

interface EcoData {
  grade: string
  count: number
  avgScore: number
}

// type EcoData = { grade: string; value: number }
type Props = { ecoFilter?: string[] }

export default function Dashboard({ ecoFilter = [] }: Props) {
  const [data, setData] = useState<EcoData[]>([])
  // const [data, setData] = useState<{ grade: string; value: number }[]>([])

  useEffect(() => {
    ;(async () => {
      const res = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/eco-score-distribution`,
      )
      const json = await res.json()
      setData(Array.isArray(json) ? json : [])
    })()
  }, [])

  // Filter the data based on the ecoFilter prop
  const filtered = useMemo(
    () =>
      ecoFilter.length
        ? data.filter((d) => ecoFilter.includes(d.grade.toUpperCase()))
        : data,
    [data, ecoFilter],
  )

  const option = {
    title: { text: 'Total of products', left: 'center' },
    xAxis: { type: 'category', data: filtered.map((d) => d.grade) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: filtered.map((d) => ({
          value: d.count,
          grade: d.grade,
          count: d.count,
          avgScore: d.avgScore,
        })),
        encode: {
          x: 'grade',
          y: 'value',
          tooltip: ['grade', 'count', 'avgScore'],
        },
      },
    ],
    tooltip: {
      formatter: (p: { data: EcoData & { value: number } }) =>
        `${p.data.grade}: <b>${p.data.count}</b> st<br/>` +
        `Snitt-score: ${p.data.avgScore}`,
    },
  }

  return (
    <ReactECharts
      option={option}
      style={{ maxWidth: '1000px', width: '100%', height: '600px' }}
    />
  )
}
