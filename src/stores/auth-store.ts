import type { AdminUser } from '@/services/types/auth.types'
import { create } from 'zustand'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const ID_TOKEN = 'id_token'
const REFRESH_TOKEN = 'refresh_token'
const USER_INFO = 'user_info'

interface AuthState {
  auth: {
    user: AdminUser | null
    setUser: (user: AdminUser | null) => void
    accessToken: string
    idToken: string
    refreshToken: string
    setAccessToken: (accessToken: string) => void
    setIdToken: (idToken: string) => void
    setRefreshToken: (refreshToken: string) => void
    saveToken: (token: string) => void
    saveTokens: (tokens: {
      accessToken: string
      idToken: string
      refreshToken: string
    }) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const idTokenState = getCookie(ID_TOKEN)
  const refreshTokenState = getCookie(REFRESH_TOKEN)

  // Token-уудыг cookie-аас унших
  const initToken =
    cookieState && cookieState !== 'undefined' ? cookieState : ''
  const initIdToken =
    idTokenState && idTokenState !== 'undefined' ? idTokenState : ''
  const initRefreshToken =
    refreshTokenState && refreshTokenState !== 'undefined'
      ? refreshTokenState
      : ''

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
      idToken: initIdToken,
      refreshToken: initRefreshToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          // Token-ийг cookie-д хадгална
          setCookie(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      setIdToken: (idToken) =>
        set((state) => {
          // ID Token-ийг cookie-д хадгална
          setCookie(ID_TOKEN, idToken)
          return { ...state, auth: { ...state.auth, idToken } }
        }),
      setRefreshToken: (refreshToken) =>
        set((state) => {
          // Refresh Token-ийг cookie-д хадгална
          setCookie(REFRESH_TOKEN, refreshToken)
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      saveToken: (token) =>
        set((state) => {
          // Token-ийг cookie болон state-д хадгална (backward compatibility)
          setCookie(ACCESS_TOKEN, token)
          return { ...state, auth: { ...state.auth, accessToken: token } }
        }),
      saveTokens: (tokens) =>
        set((state) => {
          // Бүх token-уудыг cookie болон state-д хадгална
          setCookie(ACCESS_TOKEN, tokens.accessToken)
          setCookie(ID_TOKEN, tokens.idToken)
          setCookie(REFRESH_TOKEN, tokens.refreshToken)
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: tokens.accessToken,
              idToken: tokens.idToken,
              refreshToken: tokens.refreshToken,
            },
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(ID_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: '',
              idToken: '',
              refreshToken: '',
            },
          }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(ID_TOKEN)
          removeCookie(REFRESH_TOKEN)
          if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_INFO)
          }
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              idToken: '',
              refreshToken: '',
            },
          }
        }),
    },
  }
})
