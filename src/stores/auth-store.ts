import type { AdminUser } from '@/services/types/auth.types'
import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const AUTH_TOKEN = 'auth_token'
const USER_INFO = 'user_info'

interface AuthState {
  user: AdminUser | null
  token: string
  setUser: (user: AdminUser | null) => void
  setToken: (token: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenState = getCookie(AUTH_TOKEN)

  // Token-ийг cookie-аас унших
  const initToken = tokenState && tokenState !== 'undefined' ? tokenState : ''

  const getUserFromStorage = (): AdminUser | null => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(USER_INFO)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  return {
    user: getUserFromStorage(),
    token: initToken,

    setUser: (user) => {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem(USER_INFO, JSON.stringify(user))
        } else {
          localStorage.removeItem(USER_INFO)
        }
      }
      set({ user })
    },

    setToken: (token) => {
      setCookie(AUTH_TOKEN, token)
      set({ token })
    },

    reset: () => {
      removeCookie(AUTH_TOKEN)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_INFO)
      }
      set({ user: null, token: '' })
    },
  }
})
