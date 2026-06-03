export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function request(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }

  const token = localStorage.getItem('nivaran_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
