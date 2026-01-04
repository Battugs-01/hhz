import type {
  CreateCustomerAndLoansRequest,
  CreateCustomerAndLoansResponse,
} from '../types/customer-loan.types'
import { apiClient } from './client'

export const customerLoanService = {
  createCustomerAndLoans: async (
    data: CreateCustomerAndLoansRequest
  ): Promise<CreateCustomerAndLoansResponse> => {
    const response = await apiClient.post<CreateCustomerAndLoansResponse>(
      '/customer-and-loans/create',
      data
    )
    return response.data
  },
}
