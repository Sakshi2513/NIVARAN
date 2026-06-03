'use client'

import { useState } from 'react'
import { complaintCategories } from '../lib/constants'
import { request, getAuthHeaders } from '../lib/api'

export function ComplaintForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Roads',
    city: '',
    ward: '',
    state: '',
    latitude: '28.6139',
    longitude: '77.2090'
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    const token = localStorage.getItem('nivaran_token')
    if (!token) {
      setError('Please log in first to file a complaint')
      return
    }

    try {
      await request('/api/complaints', {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          city: form.city,
          ward: form.ward,
          state: form.state,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude)
        })
      })
      setMessage('Complaint submitted successfully.')
      setForm({
        title: '',
        description: '',
        category: 'Roads',
        city: '',
        ward: '',
        state: '',
        latitude: '28.6139',
        longitude: '77.2090'
      })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/40">
      <h2 className="text-2xl font-semibold text-white">File a Complaint</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="Brief summary"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            >
              {complaintCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-slate-300">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
            rows={5}
            placeholder="Describe the issue in detail"
            required
          />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm text-slate-300">City</span>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="City"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Ward</span>
            <input
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="Ward"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">State</span>
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              placeholder="State"
              required
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Latitude</span>
            <input
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Longitude</span>
            <input
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
              required
            />
          </label>
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </div>
          <button type="submit" className="rounded-3xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Submit Complaint
          </button>
        </div>
      </form>
    </section>
  )
}
