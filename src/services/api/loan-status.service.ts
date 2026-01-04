import type {
  CreateLoanStatusRequest,
  LoanStatusListResponse,
  LoanStatusResponse,
  UpdateLoanStatusRequest,
} from '../types/loan-status.types'
import { apiClient } from './client'

export const loanStatusService = {
  listLoanStatuses: async (
    params: Record<string, unknown> = {}
  ): Promise<LoanStatusListResponse> => {
    const response = await apiClient.post<LoanStatusListResponse>(
      '/loan-status/list',
      params
    )
    return response.data
  },

  getLoanStatus: async (id: number): Promise<LoanStatusResponse> => {
    const response = await apiClient.get<LoanStatusResponse>(
      `/loan-status/${id}`
    )
    return response.data
  },

  createLoanStatus: async (
    data: CreateLoanStatusRequest
  ): Promise<LoanStatusResponse> => {
    const response = await apiClient.post<LoanStatusResponse>(
      '/loan-status/create',
      data
    )
    return response.data
  },

  updateLoanStatus: async (
    id: number,
    data: UpdateLoanStatusRequest
  ): Promise<LoanStatusResponse> => {
    const response = await apiClient.put<LoanStatusResponse>(
      `/loan-status/${id}`,
      data
    )
    return response.data
  },
}
