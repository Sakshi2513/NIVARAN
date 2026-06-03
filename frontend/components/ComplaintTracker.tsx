'use client'

import { useEffect, useState } from 'react'
import { request, getAuthHeaders } from '../lib/api'

interface ComplaintRecord {
  complaintId: string
  title: string
  status: string
  city: string
  ward: string
  severityLevel: string
}

export function ComplaintTracker() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([])

  useEffect(() => {
    async function loadTracker() {
      const token = localStorage.getItem('nivaran_token')
      if (!token) {
        setComplaints([])
        return
      }

      try {
        const data = await request('/api/complaints', {
          headers: { ...getAuthHeaders() }
        })
        setComplaints(data)
      } catch (error) {
        console.error('Failed to load complaints:', error)
        setComplaints([])
      }
    }

    loadTracker()
  }, [])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/40">
      <h2 className="text-2xl font-semibold text-white">Complaint Tracker</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-slate-400">Complaint ID</th>
              <th className="px-4 py-3 text-slate-400">Issue</th>
              <th className="px-4 py-3 text-slate-400">Location</th>
              <th className="px-4 py-3 text-slate-400">Status</th>
              <th className="px-4 py-3 text-slate-400">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {complaints.map((complaint) => (
              <tr key={complaint.complaintId} className="bg-slate-950/90">
                <td className="px-4 py-3 text-slate-200">{complaint.complaintId}</td>
                <td className="px-4 py-3 text-slate-200">{complaint.title}</td>
                <td className="px-4 py-3 text-slate-200">{complaint.city}, {complaint.ward}</td>
                <td className="px-4 py-3 text-slate-200">{complaint.status}</td>
                <td className="px-4 py-3 text-slate-200">{complaint.severityLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
