/**
 * This component renders a pie chart using Recharts library.
 * It displays the eco score of a product based on its grade and value.
 *
 * @component EcoScoreChart
 * @author Beatriz Sanssi
 */

import { PieChart, Pie, Tooltip, Cell } from 'recharts'

const COLORS = ['#4caf50', '#ffeb3b', '#f44336', '#9e9e9e']

export const EcoScoreChart = ({ data }: { data: { grade: string, value: number }[] }) => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="grade"
        outerRadius={130}
        fill="#8884d8"
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  )
}