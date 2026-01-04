import type {
  Admin,
  AdminListResponse,
  CreateAdminRequest,
  DeleteAdminResponse,
  UpdateAdminRequest,
} from '../types/admin.types'
import type { BaseResponse } from '../types/common.types'
import { apiClient } from './client'

export const adminService = {
  /**
   * Admins жагсаалт авах
   */
  listAdmins: async (
    params: Record<string, unknown> = {}
  ): Promise<AdminListResponse> => {
    const response = await apiClient.post<AdminListResponse>(
      '/users/list',
      params
    )
    return response.data
  },

  /**
   * Admin үүсгэх
   */
  createAdmin: async (
    data: CreateAdminRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      '/users/create',
      data
    )
    return response.data
  },

  /**
   * Admin засах
   */
  updateAdmin: async (
    data: UpdateAdminRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.put<BaseResponse<null>>(
      `/users/${data.id}`,
      data
    )
    return response.data
  },

  /**
   * Admin устгах
   */
  deleteAdmin: async (id: number): Promise<DeleteAdminResponse> => {
    const response = await apiClient.delete<DeleteAdminResponse>(`/users/${id}`)
    return response.data
  },

  /**
   * Admin дэлгэрэнгүй мэдээлэл авах
   */
  getAdmin: async (id: number): Promise<BaseResponse<Admin>> => {
    const response = await apiClient.get<BaseResponse<Admin>>(`/users/${id}`)
    return response.data
  },
}
