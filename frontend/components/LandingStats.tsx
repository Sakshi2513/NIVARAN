'use client'

const stats = [
  { value: '12K+', label: 'Complaints Filed' },
  { value: '8.5K+', label: 'Resolved Issues' },
  { value: '95%', label: 'Citizen Satisfaction' },
  { value: '120+', label: 'High Risk Zones' }
]

export function LandingStats() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
          <p className="text-3xl font-semibold text-cyan-400">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
