'use client'

const features = [
  { title: 'File complaints fast', description: 'Log issues with geo-location and category classification.' },
  { title: 'Track progress', description: 'Monitor status updates, assignment, and resolution history.' },
  { title: 'Government analytics', description: 'Use KPI dashboards and heat maps for higher impact.' },
  { title: 'Safe reporting', description: 'Citizen-first grievance tracking with accountability.' }
]

export function LandingFeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature) => (
        <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
          <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
          <p className="mt-3 text-slate-300">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
