import type { AdminUser } from '@/services/types/auth.types'
import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_INFO = 'user_info'

interface AuthState {
  auth: {
    user: AdminUser | null
    setUser: (user: AdminUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    saveToken: (token: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  // Token-ийг cookie-аас унших
  const initToken =
    cookieState && cookieState !== 'undefined' ? cookieState : ''

  const getUserFromStorage = () => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(USER_INFO)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  return {
    auth: {
      user: getUserFromStorage(),
      setUser: (user) => {
        if (typeof window !== 'undefined') {
          if (user) {
            localStorage.setItem(USER_INFO, JSON.stringify(user))
          } else {
            localStorage.removeItem(USER_INFO)
          }
        }
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          // Token-ийг cookie-д хадгална
          setCookie(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      saveToken: (token) =>
        set((state) => {
          // Token-ийг cookie болон state-д хадгална
          setCookie(ACCESS_TOKEN, token)
          return { ...state, auth: { ...state.auth, accessToken: token } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_INFO)
          }
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
