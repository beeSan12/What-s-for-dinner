/**
 * This component renders a scatter plot using ECharts library.
 * It compares the eco-score and calories of different products.
 *
 * @component EcoScatter
 * @author Beatriz Sanssi
 */

import { useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { Product } from '../interface/Product'
import { Nutrition } from '../interface/Nutrition'

interface ProductWithNutri extends Product {
  nutrition?: Nutrition
}

type Props = { products: ProductWithNutri[] }

/**
 * This function renders a scatter plot using ECharts library.
 * It compares the eco-score and calories of different products.
 */
export default function EcoScatter({ products }: Props) {
  const chartRef = useRef<ReactECharts | null>(null)
  const datasetSrc = products

    .filter(
      (p) =>
        p.eco_score &&
        Number.isFinite(p.eco_score.score) &&
        p.nutrition &&
        Number.isFinite(Number(p.nutrition.calories)),
    )
    .map((p) => [
      p.eco_score!.score,
      Number(p.nutrition!.calories), // Parse calories to number
      p.product_name,
      p.eco_score!.grade.toUpperCase(),
    ])
    .sort((a, b) => Number(a[0]) - Number(b[0]))

  // Sort the dataset by eco-score
  const option = {
    xAxis: { name: 'Eco-score', min: 0, max: 100 },
    yAxis: { name: 'kcal / 100 g', min: 0 },
    dataset: { source: datasetSrc },
    series: [
      { type: 'scatter', symbolSize: 8, encode: { tooltip: [2, 0, 1, 3] } },
    ],
    tooltip: {
      formatter: (params: { data: (string | number)[] }) =>
        `<strong>${params.data[2]}</strong><br/>Eco ${params.data[0]} → ${params.data[1]} kcal`,
    },
  }

  // Resize the chart when the window is resized
  useEffect(() => {
    const handleResize = () => chartRef.current?.getEchartsInstance()?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  )
}
