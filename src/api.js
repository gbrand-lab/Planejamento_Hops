export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

export function apiUrl(path) {
  return `${API_BASE}${path}`
}
