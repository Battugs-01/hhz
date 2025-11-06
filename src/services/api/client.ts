import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
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
      // Token хүчингүй болсон, logout хийх
      useAuthStore.getState().auth.reset()
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in'
      }
    }

    // Error response-оос message-ийг extract хийх
    if (error.response?.data) {
      const errorData = error.response.data as {
        message?: string
        body?: unknown
      }
      if (errorData.message) {
        // Error message-ийг error object-д нэмэх
        const customError = new Error(errorData.message)
        return Promise.reject(customError)
      }
    }

    return Promise.reject(error)
  }
)
