import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const AWS_SERVERLESS_API_URL =
  import.meta.env.VITE_AWS_SERVERLESS_API_URL ||
  'https://api.x-meta.com/api/staking/v3'
const NEWS_API_URL =
  import.meta.env.VITE_NEWS_API_URL || 'http://api.x-meta.com/api/news/admin'

const TAKE_ACTION_API_URL =
  import.meta.env.VITE_TAKE_ACTION_API_URL || 'http://api.x-meta.com/api/take-action/admin'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const takeActionApiClient: AxiosInstance = axios.create({
  baseURL: TAKE_ACTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const stakingApiClient: AxiosInstance = axios.create({
  baseURL: AWS_SERVERLESS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const newsApiClient: AxiosInstance = axios.create({
  baseURL: NEWS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const idToken = useAuthStore.getState().auth.idToken
    const accessToken = useAuthStore.getState().auth.accessToken
    const token = idToken || accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const isAuthRequest =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/mfa-challenge')

      if (!isAuthRequest) {
        useAuthStore.getState().auth.reset()
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in'
        }
      }
    }

    if (error.response?.data) {
      const errorData = error.response.data as {
        message?: string
        body?: unknown
      }
      if (errorData.message) {
        const customError = new Error(errorData.message)
        return Promise.reject(customError)
      }
    }

    return Promise.reject(error)
  }
)

stakingApiClient.interceptors.request.use(
  (config) => {
    const idToken = useAuthStore.getState().auth.idToken
    const accessToken = useAuthStore.getState().auth.accessToken
    const token = idToken || accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

stakingApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 алдаа гарвал logout хийж, sign-in хуудас руу redirect хийх
      useAuthStore.getState().auth.reset()
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
      return Promise.reject(error)
    }

    if (error.response?.data) {
      const errorData = error.response.data as {
        msg?: string
        message?: string
        body?: unknown
      }
      const errorMessage = errorData.msg || errorData.message
      if (errorMessage) {
        const customError = new Error(errorMessage)
        return Promise.reject(customError)
      }
    }

    return Promise.reject(error)
  }
)

newsApiClient.interceptors.request.use(
  (config) => {
    const idToken = useAuthStore.getState().auth.idToken
    const accessToken = useAuthStore.getState().auth.accessToken
    const token = idToken || accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

newsApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 алдаа гарвал logout хийж, sign-in хуудас руу redirect хийх
      useAuthStore.getState().auth.reset()
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
      return Promise.reject(error)
    }

    if (error.response?.data) {
      const errorData = error.response.data as {
        msg?: string
        message?: string
        data?: unknown
      }
      const errorMessage = errorData.msg || errorData.message
      if (errorMessage) {
        const customError = new Error(errorMessage)
        return Promise.reject(customError)
      }
    }

    return Promise.reject(error)
  }
)


takeActionApiClient.interceptors.request.use(
  (config) => {
    const idToken = useAuthStore.getState().auth.idToken
    const accessToken = useAuthStore.getState().auth.accessToken
    const token = idToken || accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

takeActionApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 алдаа гарвал logout хийж, sign-in хуудас руу redirect хийх
      useAuthStore.getState().auth.reset()
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
      return Promise.reject(error)
    }

    if (error.response?.data) {
      const errorData = error.response.data as {
        msg?: string
        message?: string
        data?: unknown
      }
      const errorMessage = errorData.msg || errorData.message
      if (errorMessage) {
        const customError = new Error(errorMessage)
        return Promise.reject(customError)
      }
    }

    return Promise.reject(error)
  }
)
