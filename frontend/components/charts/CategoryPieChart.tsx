'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#22d3ee', '#38bdf8', '#818cf8', '#f97316', '#fb7185', '#34d399']

interface CategoryPieChartProps {
  data: { category: string; count: number }[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-lg font-semibold text-white">Category Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="category" outerRadius={90} innerRadius={50}>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} complaints`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
