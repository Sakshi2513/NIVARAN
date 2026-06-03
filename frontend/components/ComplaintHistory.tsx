'use client'

import { useEffect, useState } from 'react'
import { request, getAuthHeaders } from '../lib/api'

interface ComplaintRecord {
  complaintId: string
  title: string
  category: string
  status: string
  severityLevel: string
  createdAt: string
}

export function ComplaintHistory() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([])

  useEffect(() => {
    async function loadHistory() {
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

    loadHistory()
  }, [])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/40">
      <h2 className="text-2xl font-semibold text-white">Complaint History</h2>
      <div className="mt-6 space-y-4">
        {complaints.length === 0 ? (
          <p className="text-slate-400">No complaints found yet. File a new grievance to see it here.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.complaintId} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{complaint.title}</h3>
                    <p className="text-sm text-slate-400">{complaint.category}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-300">
                    {complaint.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
                  <span>Severity: {complaint.severityLevel}</span>
                  <span>Filed on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
