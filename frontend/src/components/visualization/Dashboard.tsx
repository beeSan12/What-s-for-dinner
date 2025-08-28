/**
 * This component displays a dashboard with a bar chart representing the distribution of eco-scores.
 * It fetches the data from an API endpoint and filters it based on the provided ecoFilter prop.
 *
 * @component Dashboard
 * @author Beatriz Sanssi
 */

import { useEffect, useRef, useState, useMemo } from 'react'
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
  const chartRef = useRef<ReactECharts | null>(null)

  useEffect(() => {
    ;(async () => {
      const json = await apiFetch<EcoData[]>(
        `${import.meta.env.VITE_API_BASE_URL}/statistics/eco-score-distribution`,
      )
      setData(Array.isArray(json) ? json : [])
    })()
  }, [])

  useEffect(() => {
    const resize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize()
      }
    }

    // Timeout to wait for layout to stabilize
    setTimeout(resize, 100)

    // Trigger resize on window resize too
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
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
    title: {
      text: `Total of products: ${filtered.reduce((sum, d) => sum + d.count, 0)}`,
      left: 'center',
    },
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
    <div style={{ width: '350px', height: '400px' }}>
      <ReactECharts
        option={option}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  )
}
