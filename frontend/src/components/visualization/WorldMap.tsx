/**
 * This component renders a world map using ECharts library.
 * It displays the origin of products based on their country codes.
 *
 * @component OriginMap
 * @author Beatriz Sanssi
 */

import { useEffect, useRef, useMemo, useState } from 'react'
import * as echarts from 'echarts/core'
import { MapChart, PieChart } from 'echarts/charts'
import {
  GeoComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ReactECharts from 'echarts-for-react'
import iso2LatLon from '../../assets/iso2LatLon.json'
import { apiFetch } from '../../utils/apiFetch'
import worldGeoJSON from '../../assets/world.geo.json'
import type { FeatureCollection, Feature } from 'geojson'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
countries.registerLocale(enLocale)
// import { originSynonyms } from '../../utils/OriginSynonyms'

const iso2LatLonRaw = iso2LatLon as Record<string, number[]>
const worldGeoJSONTyped = worldGeoJSON as FeatureCollection

echarts.use([
  MapChart,
  PieChart,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

type CountryData = {
  cc: string
  total: number
  origin?: string
  // grades: Record<string, number>   // { A: 12, B: 3, … }
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
  if (!Array.isArray(data)) return []
  const total = data.reduce((sum, d) => sum + d.total, 0)

  return data.flatMap((c) => {
    const center = coord(c.cc)
    if (!center) return []

    return {
      name: c.cc,
      type: 'pie' as const,
      coordinateSystem: 'geo' as const,
      radius: 8,
      center,
      // label: { show: false },
      label: {
        show: false,
        formatter: '{b}',
        overflow: 'truncate',
        position: 'inside',
      },
      labelLine: {
        show: false,
      },
      labelLayout: {
        hideOverlap: true,
      },
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function (params: {
          data: { value: number; origin?: string }
        }) {
          const count = params.data.value
          const origin = params.data.origin ?? c.cc
          const percent = ((count / total) * 100).toFixed(1)
          return `${origin}<br/>${count} produkter · ${percent}%`
        },
      },
      //   formatter: function (params: {
      //     data: { value: number; origin?: string }
      //     percent: number
      //   }) {
      //     return `${params.data.origin ?? c.cc}<br/>${params.data.value} st · ${params.percent.toFixed(1)}%`
      //   },
      // },
      data: [{ name: c.cc, value: c.total, origin: c.origin }],
    }
  })
}

export default function OriginMap() {
  const [data, setData] = useState<CountryData[]>([])
  const [ready, setReady] = useState(false)
  const chartRef = useRef<ReactECharts | null>(null)
  

  // 1) Load GeoJSON-data for world map
  useEffect(() => {
    const transformedGeoJson: FeatureCollection = {
      ...worldGeoJSONTyped,
      features: worldGeoJSONTyped.features.map((feature: Feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          name: feature.properties?.iso_a2, // ISO2 becomes name
        },
      })),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    echarts.registerMap('world', transformedGeoJson as any)
    setReady(true)
  }, [])

  // 2) Resize the chart when the window is resized
  useEffect(() => {
  const resize = () => {
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().resize()
    }
  }

  // Timeout to wait for layout/rendering to complete
  setTimeout(resize, 100)

  window.addEventListener('resize', resize)
  return () => window.removeEventListener('resize', resize)
}, [])

  // 3) Get the aggregated data from the server
  useEffect(() => {
    ;(async () => {
      try {
        const json = await apiFetch<CountryData[]>(
          `${import.meta.env.VITE_API_BASE_URL}/products/origin-map`,
        )
        const transformed = json.map((d: CountryData) => {
          const originName = countries.getName(d.cc, 'en') || d.cc
          return {
            ...d,
            origin: originName,
          }
        })

        // Check if all country codes have coordinates
        transformed.forEach((d) => {
          const c = coord(d.cc)
          if (!c) console.warn('❗ Missing coordinates for:', d.cc)
        })

        console.log('Transformed data:', transformed)
        console.log('Data from /origin-map:', json)

        setData(transformed)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  // 4) Memoize the option object to avoid unnecessary re-renders
  const option = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#eee',
          borderColor: '#999',
        },
        emphasis: { itemStyle: { areaColor: '#ccc' } },
      },
      series: ready && data.length > 0 ? seriesFromData(data) : [],
    }),
    [ready, data],
  )
  console.log(seriesFromData(data))
  // 5) Conditionally render loading
  if (!ready) {
    return <p>Loading map…</p>
  }

  return (
    <div style={{ width: '100vh', height: '70vh' }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{
          width: '100%',
          height: '100%',
          // margin: '0 auto',
        }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  )
}
