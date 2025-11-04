import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_INFO = 'user_info'

interface AuthUser {
  id: string
  email: string
  adminGroupId: string
  adminGroup: any
  status: string
  isEnabled: boolean
  userCreateDate: string
  password: string
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    saveToken: (token: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken =
    cookieState && cookieState !== 'undefined' ? JSON.parse(cookieState) : ''

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
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      saveToken: (token) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(token))
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
