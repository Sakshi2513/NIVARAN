'use client'

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendLineChartProps {
  data: { date: string; count: number }[]
}

export function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
      <h3 className="text-lg font-semibold text-white">Complaint Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#cbd5e1' }} />
            <YAxis tick={{ fill: '#cbd5e1' }} />
            <Tooltip formatter={(value: number) => `${value}`} />
            <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
