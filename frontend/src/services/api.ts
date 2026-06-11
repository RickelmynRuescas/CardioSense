import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function getToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Usuário não autenticado')
  return user.getIdToken()
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Erro na requisição')
  return data
}

export const api = {
  profile: {
    save: (profile: object) =>
      request('/profile', { method: 'POST', body: JSON.stringify(profile) }),
    get: () =>
      request('/profile'),
  },
  measurements: {
    save: (measurement: object) =>
      request('/measurements', { method: 'POST', body: JSON.stringify(measurement) }),
    list: () =>
      request<any[]>('/measurements'),
    delete: (id: string) =>
      request(`/measurements/${id}`, { method: 'DELETE' }),
    deleteAll: () =>
      request('/measurements/all', { method: 'DELETE' }),
  },
}
