import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement)

interface Props {
  totals: { calories: number; protein: number; carbs: number; fat: number, fiber: number; sugar: number; salt: number; saturated_fat: number; cholesterol: number; sodium: number }
}

export default function NutritionChart({ totals }: Props) {
  const data = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat', 'Sugars', 'Fiber', 'Salt', 'Saturated Fat', 'Cholesterol', 'Sodium'],
    datasets: [
      {
        label: 'Total',
        data: [totals.calories, totals.protein, totals.carbs, totals.fat, totals.sugar, totals.fiber, totals.salt, totals.saturated_fat, totals.cholesterol, totals.sodium],
        backgroundColor: 'rgba(47,79,79,0.6)',
      },
    ],
  }

  const options = {
    scales: {
      y: { beginAtZero: true },
    },
  }

  return <Bar data={data} options={options} />
}
