/**
 * This component renders a world map using ECharts library.
 * It displays the origin of products based on their country codes.
 *
 * @component OriginMap
 * @author Beatriz Sanssi
 */

import { useEffect, useMemo, useState } from 'react'
import * as echarts from 'echarts/core'
import { MapChart, PieChart } from 'echarts/charts'
import {
  GeoComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactECharts from 'echarts-for-react'
import iso2LatLon from '../../assets/iso2LatLon.json'  //  { "SE": [18, 62], ... }
import { apiFetch } from '../../utils/apiFetch'

const iso2LatLonRaw = iso2LatLon as Record<string, number[]>

echarts.use([
  MapChart,
  PieChart,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
])

type CountryData = {
  cc: string
  total: number
  grades: Record<string, number>   // { A: 12, B: 3, … }
}

/**
 * Help function to convert ISO2 country code to latitude and longitude.
 * @param cc - ISO2 country code
 * @returns - Tuple of latitude and longitude or undefined if not found.
*/
function coord(cc: string): [number, number] | undefined {
  const arr = iso2LatLonRaw[cc.toUpperCase()]
  if (Array.isArray(arr) && arr.length >= 2) {
    // Cast safely to [number, number]
    return [arr[0], arr[1]] as [number, number]
  }
  return undefined
}

/**
 * Function to create series data for ECharts from country data.
 *
 * @param data - Array of country data
 * @returns - Array of series data for ECharts
 */
function seriesFromData(data: CountryData[]) {
  return data.flatMap(c => {
    const center = coord(c.cc)
    if (!center) return []

    return {
      name: c.cc,
      type: 'pie' as const,
      coordinateSystem: 'geo' as const,
      radius: 8,
      center,
      label: { show: false },
      tooltip: { formatter: '{b}<br/>{c} st · {d}%' },
      data: Object.entries(c.grades).map(([grade, value]) => ({
        name: grade,
        value
      }))
    }
  })
}

export default function OriginMap() {
  const [data,  setData]  = useState<CountryData[]>([])
  const [ready, setReady] = useState(false)

  // 1) Load GeoJSON-data for world map
  useEffect(() => {
    fetch(
      'https://cdn.jsdelivr.net/npm/echarts@5/examples/data/asset/world.geo.json'
    )
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((geo: any) => {
        echarts.registerMap('world', geo)
        setReady(true)
      })
      .catch(console.error)
  }, [])

  // 2) Get the aggregated data from the server
  useEffect(() => {
    ;(async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/origin-map`
        )
        const json = await response.json()
        setData(json as CountryData[])
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])


  // 3) Memoize the option object to avoid unnecessary re-renders
  const option = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    geo: {
      map: 'world',
      roam: true,
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#999'
      },
      emphasis: { itemStyle: { areaColor: '#ccc' } }
    },
    series: ready ? seriesFromData(data) : []
  }), [ready, data])

  // 4) Conditionally render loading
  if (!ready) {
    return <p>Loading map…</p>
  }

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: 600 }}
    />
  )
}