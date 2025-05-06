import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement)

interface Props {
  totals: { calories: number; protein: number; carbs: number; fat: number }
}

export default function NutritionChart({ totals }: Props) {
  const data = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Total',
        data: [
          totals.calories,
          totals.protein,
          totals.carbs,
          totals.fat
        ],
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