import { useAuthStore } from '@/stores/auth-store'

export const usersService = {
  list: async (body: Record<string, unknown> = {}) => {
    const API_URL = import.meta.env.VITE_API_URL
    const token = useAuthStore.getState().auth.accessToken

    const res = await fetch(`${API_URL}/users/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: 'Failed to fetch users' }))
      throw new Error(err.message || 'Failed to fetch users')
    }

    return res.json()
  },
}

export default usersService
