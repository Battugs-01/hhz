import type { UserListResponse } from '../types/kyc.types'
import { apiClient } from './client'

export const kycService = {
  /**
   * Users list авах
   */
  listUsers: async (
    body: Record<string, unknown> = {}
  ): Promise<UserListResponse> => {
    // Token нь apiClient interceptor-оор автоматаар нэмэгдэнэ
    const response = await apiClient.post<UserListResponse>('/users/list', body)
    return response.data
  },
}
