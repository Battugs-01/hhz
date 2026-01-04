import type {
  CreateJudgeCloseStatusRequest,
  DeleteJudgeCloseStatusResponse,
  JudgeCloseStatusListRequest,
  JudgeCloseStatusListResponse,
  JudgeCloseStatusResponse,
  UpdateJudgeCloseStatusRequest,
} from '../types/judge-close-status.types'
import { apiClient } from './client'

export const judgeCloseStatusService = {
  /**
   * Шүүхийн хаах төлвүүдийн жагсаалт авах
   */
  listJudgeCloseStatuses: async (
    params: JudgeCloseStatusListRequest = {}
  ): Promise<JudgeCloseStatusListResponse> => {
    const response = await apiClient.post<JudgeCloseStatusListResponse>(
      '/judge-close-status/list',
      params
    )
    return response.data
  },

  /**
   * Шүүхийн хаах төлөв үүсгэх
   */
  createJudgeCloseStatus: async (
    data: CreateJudgeCloseStatusRequest
  ): Promise<JudgeCloseStatusResponse> => {
    const response = await apiClient.post<JudgeCloseStatusResponse>(
      '/judge-close-status/create',
      data
    )
    return response.data
  },

  /**
   * Шүүхийн хаах төлөв шинэчлэх
   */
  updateJudgeCloseStatus: async (
    id: number,
    data: UpdateJudgeCloseStatusRequest
  ): Promise<JudgeCloseStatusResponse> => {
    const response = await apiClient.put<JudgeCloseStatusResponse>(
      `/judge-close-status/update/${id}`,
      data
    )
    return response.data
  },

  /**
   * Шүүхийн хаах төлөв устгах
   */
  deleteJudgeCloseStatus: async (
    id: number
  ): Promise<DeleteJudgeCloseStatusResponse> => {
    const response = await apiClient.delete<DeleteJudgeCloseStatusResponse>(
      `/judge-close-status/delete/${id}`
    )
    return response.data
  },
}
