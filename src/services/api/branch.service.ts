import type {
  BranchListResponse,
  BranchResponse,
  CreateBranchRequest,
  DeleteBranchResponse,
  UpdateBranchRequest,
} from '../types/branch.types'
import type { BaseResponse } from '../types/common.types'
import { apiClient } from './client'

export const branchService = {
  /**
   * Branches жагсаалт авах
   */
  listBranches: async (
    params: Record<string, unknown> = {}
  ): Promise<BranchListResponse> => {
    const response = await apiClient.post<BranchListResponse>(
      '/branches/list',
      params
    )
    return response.data
  },

  /**
   * Branch үүсгэх
   */
  createBranch: async (
    data: CreateBranchRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      '/branches/create',
      data
    )
    return response.data
  },

  /**
   * Branch засах
   */
  updateBranch: async (
    data: UpdateBranchRequest
  ): Promise<BaseResponse<null>> => {
    const { id, ...body } = data
    const response = await apiClient.put<BaseResponse<null>>(
      `/branches/${id}`,
      body
    )
    return response.data
  },

  /**
   * Branch устгах
   */
  deleteBranch: async (id: number): Promise<DeleteBranchResponse> => {
    const response = await apiClient.delete<DeleteBranchResponse>(
      `/branches/${id}`
    )
    return response.data
  },

  /**
   * Branch дэлгэрэнгүй мэдээлэл авах
   */
  getBranch: async (id: number): Promise<BranchResponse> => {
    const response = await apiClient.get<BranchResponse>(`/branches/${id}`)
    return response.data
  },
}
