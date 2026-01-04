import type { BaseResponse } from '../types/common.types'
import type {
  CreateEconomistRequest,
  EconomistListRequest,
  EconomistListResponse,
  EconomistResponse,
  UpdateEconomistRequest,
} from '../types/economist.types'
import { apiClient } from './client'

export const economistService = {
  /**
   * Эдийн засагчийн жагсаалт авах
   */
  listEconomists: async (
    params: EconomistListRequest = {}
  ): Promise<EconomistListResponse> => {
    const response = await apiClient.post<EconomistListResponse>(
      '/economists/list',
      params
    )
    return response.data
  },

  /**
   * Эдийн засагчийн дэлгэрэнгүй мэдээлэл авах
   */
  getEconomist: async (id: number): Promise<EconomistResponse> => {
    const response = await apiClient.get<EconomistResponse>(`/economists/${id}`)
    return response.data
  },

  /**
   * Шинэ эдийн засагч үүсгэх
   */
  createEconomist: async (
    data: CreateEconomistRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      '/economists/create',
      data
    )
    return response.data
  },

  /**
   * Эдийн засагчийн мэдээлэл засах
   */
  updateEconomist: async (
    data: UpdateEconomistRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.put<BaseResponse<null>>(
      `/economists/${data.id}`,
      data
    )
    return response.data
  },

  /**
   * Эдийн засагч устгах
   */
  deleteEconomist: async (id: number): Promise<BaseResponse<null>> => {
    const response = await apiClient.delete<BaseResponse<null>>(
      `/economists/${id}`
    )
    return response.data
  },
}
