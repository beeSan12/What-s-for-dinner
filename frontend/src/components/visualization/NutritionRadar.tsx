/**
 * This component renders a nutrition radar chart using ECharts library.
 * It visualizes the nutritional values of a product in a radar format.
 *
 * @component NutritionRadar
 * @author Beatriz Sanssi
 */

import ReactECharts from 'echarts-for-react'
import { Nutrition } from '../interface/Nutrition'

type Props = { nutr: Nutrition; title: string }

export default function NutritionRadar({ nutr, title }: Props) {
  const option = {
    title: { text: title, left: 'center' },
    radar: {
      indicator: [
        { name: 'Protein', max: 50 },
        { name: 'Fat',     max: 50 },
        { name: 'Carbs',   max: 80 },
        { name: 'Fiber',   max: 20 },
        { name: 'Sugar',   max: 60 },
        { name: 'Salt',    max: 5  },
        { name: 'Saturated Fat', max: 20 },
        { name: 'Cholesterol',   max: 300 },
        { name: 'Sodium',       max: 2000 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              nutr.protein,
              nutr.fat,
              nutr.carbs,
              nutr.fiber,
              nutr.sugar,
              nutr.salt,
              nutr.saturated_fat,
              nutr.cholesterol,
              nutr.sodium,
            ],
            name: title,
            areaStyle: { opacity: 0.25 },
          },
        ],
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />
}