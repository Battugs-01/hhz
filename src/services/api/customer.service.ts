import type {
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
} from '../types/customer.types'
import { apiClient } from './client'

export const customerService = {
  /**
   * Customers жагсаалт авах
   */
  listCustomers: async (
    params: Record<string, unknown> = {}
  ): Promise<CustomerListResponse> => {
    const response = await apiClient.post<CustomerListResponse>(
      '/customers/list',
      params
    )
    return response.data
  },

  /**
   * Customer дэлгэрэнгүй мэдээлэл авах
   */
  getCustomer: async (id: number): Promise<CustomerResponse> => {
    const response = await apiClient.get<CustomerResponse>(`/customers/${id}`)
    return response.data
  },

  /**
   * Customer мэдээлэл шинэчлэх (байршил)
   */
  updateCustomer: async (
    id: number,
    data: UpdateCustomerRequest
  ): Promise<UpdateCustomerResponse> => {
    const response = await apiClient.patch<UpdateCustomerResponse>(
      `/customers/${id}`,
      data
    )
    return response.data
  },
}
