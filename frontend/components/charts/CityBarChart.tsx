'use client'

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface CityBarChartProps {
  data: { city: string; count: number }[]
}

export function CityBarChart({ data }: CityBarChartProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-lg font-semibold text-white">City Complaint Trends</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="city" tick={{ fill: '#cbd5e1' }} />
            <YAxis tick={{ fill: '#cbd5e1' }} />
            <Tooltip formatter={(value: number) => `${value}`} />
            <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
