import axios from 'axios'
import type {
  LoginCredentials,
  LoginResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UserInfoResponse,
} from '../types/auth.types'
import { apiClient } from './client'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as {
          message?: string
        }
        throw new Error(errorData.message || 'Login failed')
      }
      throw error
    }
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    const response = await apiClient.get<UserInfoResponse>('/account/info')
    return response.data
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.log('Logout endpoint not available')
    }
  },

  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> => {
    try {
      const response = await apiClient.put<UpdatePasswordResponse>(
        '/account/change-password',
        data
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as {
          message?: string
        }
        throw new Error(errorData.message || 'Failed to update password')
      }
      throw error
    }
  },
}
