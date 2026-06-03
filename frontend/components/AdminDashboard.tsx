'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { request, getAuthHeaders } from '../lib/api'
import { CategoryPieChart } from './charts/CategoryPieChart'
import { CityBarChart } from './charts/CityBarChart'
import { TrendLineChart } from './charts/TrendLineChart'
import { AdminMap } from './maps/AdminMap'

interface OverviewData {
  total: number
  pending: number
  resolved: number
  escalated: number
}

interface AnalyticsData {
  byCity: { _id: string; count: number }[]
  byCategory: { _id: string; count: number }[]
}

interface RiskZone {
  area: string
  complaintCount: number
  mostCommonCategory: string
  severity: number
}

export function AdminDashboard() {
  const router = useRouter()
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [zones, setZones] = useState<RiskZone[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const token = localStorage.getItem('nivaran_token')
      
      if (!token) {
        setError('Please log in to access the dashboard')
        setLoading(false)
        return
      }

      try {
        const headers = { ...getAuthHeaders() }
        const overviewData = await request('/api/analytics/overview', { headers })
        const locationData = await request('/api/analytics/location', { headers })
        const highRisk = await request('/api/analytics/high-risk-zones', { headers })
        setOverview(overviewData)
        setAnalytics(locationData)
        setZones(highRisk)
        setError('')
      } catch (err) {
        const message = (err as Error).message
        if (message.includes('Unauthorized')) {
          setError('Unauthorized. Please log in again.')
          localStorage.removeItem('nivaran_token')
        } else {
          setError(message || 'Failed to load analytics')
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const categoryData = analytics?.byCategory.map((row) => ({ category: row._id, count: row.count })) || []
  const cityData = analytics?.byCity.map((row) => ({ city: row._id, count: row.count })) || []
  const trendData = cityData.map((item, index) => ({ date: `Week ${index + 1}`, count: item.count }))

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center">
        <p className="text-slate-300">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-800 bg-red-900/20 p-8">
        <p className="text-red-400">{error}</p>
        {!localStorage.getItem('nivaran_token') && (
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 rounded-3xl bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Go to Login
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {overview ? (
          [
            { label: 'Total Complaints', value: overview.total },
            { label: 'Pending', value: overview.pending },
            { label: 'Resolved', value: overview.resolved },
            { label: 'Escalated', value: overview.escalated }
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))
        ) : (
          <div className="md:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">Loading analytics…</div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <CategoryPieChart data={categoryData.length ? categoryData : [{ category: 'No data', count: 1 }]} />
        <CityBarChart data={cityData.length ? cityData : [{ city: 'No Data', count: 1 }]} />
        <TrendLineChart data={trendData.length ? trendData : [{ date: 'Week 1', count: 0 }]} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <h3 className="text-lg font-semibold text-white">High Risk Zones</h3>
          <div className="mt-6 space-y-4">
            {zones.length === 0 ? (
              <p className="text-slate-400">No high risk zones available yet.</p>
            ) : (
              zones.map((zone) => (
                <div key={zone.area} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-semibold text-white">{zone.area}</p>
                  <p className="mt-2 text-sm text-slate-400">Complaints: {zone.complaintCount}</p>
                  <p className="text-sm text-slate-400">Most common: {zone.mostCommonCategory}</p>
                  <p className="text-sm text-slate-400">Avg severity: {zone.severity}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="xl:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <h3 className="text-lg font-semibold text-white">Complaint Map</h3>
          <div className="mt-6">
            <AdminMap height="320px" />
          </div>
        </div>
      </div>
    </div>
  )
}
