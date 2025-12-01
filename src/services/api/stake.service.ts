import type { BaseResponse } from '../types/common.types'
import type {
  StakeAssetCreateParams,
  StakeAssetListBackendResponse,
  StakeAssetListParams,
  StakeAssetListResponse,
  StakeAssetResponse,
  StakeAssetUpdateParams,
  StakeContractCreateParams,
  StakeContractListBackendResponse,
  StakeContractListParams,
  StakeContractListResponse,
  StakeContractResponse,
  StakeContractUpdateParams,
  TotalUsersStakesInfo,
  TotalUsersStakesInfoResponse,
  UserStakeListBackendResponse,
  UserStakeListParams,
  UserStakeListResponse,
} from '../types/stake.types'
import { stakingApiClient } from './client'

export const stakeService = {
  // Stake Asset methods
  listStakeAssets: async (
    params: StakeAssetListParams = {}
  ): Promise<StakeAssetListResponse> => {
    const apiBody: Record<string, unknown> = {}

    if (
      params.lastEvaluatedKey !== undefined &&
      params.lastEvaluatedKey !== null
    ) {
      // Parse string to object if needed - Axios will automatically stringify objects
      if (typeof params.lastEvaluatedKey === 'string') {
        try {
          // Try to parse the string as JSON to get object
          apiBody.lastEvaluatedKey = JSON.parse(params.lastEvaluatedKey)
        } catch {
          // If parsing fails, treat it as a plain string value wrapped in object
          apiBody.lastEvaluatedKey = {
            value: params.lastEvaluatedKey,
          }
        }
      } else {
        // Already an object, use it directly
        apiBody.lastEvaluatedKey = params.lastEvaluatedKey
      }
    }

    const response = await stakingApiClient.post<StakeAssetListBackendResponse>(
      '/admin/stake/assets/list',
      apiBody
    )
    return {
      message: response.data.msg || 'Success',
      body: {
        items: response.data.data.list || [],
        total: response.data.data.total || response.data.data.list?.length || 0,
        lastEvaluatedKey: response.data.data.lastEvaluatedKey,
      },
    }
  },

  getStakeAssetById: async (asset: string): Promise<StakeAssetResponse> => {
    const response = await stakingApiClient.get<StakeAssetResponse>(
      `/admin/stake/assets/${asset}`
    )
    return response.data
  },

  createStakeAsset: async (
    params: StakeAssetCreateParams
  ): Promise<StakeAssetResponse> => {
    const response = await stakingApiClient.post<StakeAssetResponse>(
      '/admin/stake/assets',
      params
    )
    return response.data
  },

  updateStakeAsset: async (
    asset: string,
    params: StakeAssetUpdateParams
  ): Promise<StakeAssetResponse> => {
    const response = await stakingApiClient.put<StakeAssetResponse>(
      `/admin/stake/assets/${asset}`,
      params
    )
    return response.data
  },

  uploadStakeAssetImage: async (
    file: File
  ): Promise<BaseResponse<{ imageUrl: string }>> => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await stakingApiClient.post<{
      data: { stakeAssetImageUrl?: string; message?: string }
      msg: string
      code: number
    }>('/admin/stake/assets/image-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      message: response.data.msg || response.data.data?.message || 'Success',
      body: response.data.data
        ? {
            imageUrl: response.data.data.stakeAssetImageUrl || '',
          }
        : null,
    }
  },

  // Stake Contract methods
  listStakeContracts: async (
    params: StakeContractListParams = {}
  ): Promise<StakeContractListResponse> => {
    const apiBody: Record<string, unknown> = {}

    if (
      params.lastEvaluatedKey !== undefined &&
      params.lastEvaluatedKey !== null
    ) {
      // Parse string to object if needed - Axios will automatically stringify objects
      if (typeof params.lastEvaluatedKey === 'string') {
        try {
          // Try to parse the string as JSON to get object
          apiBody.lastEvaluatedKey = JSON.parse(params.lastEvaluatedKey)
        } catch {
          // If parsing fails, treat it as a plain string value wrapped in object
          apiBody.lastEvaluatedKey = {
            value: params.lastEvaluatedKey,
          }
        }
      } else {
        // Already an object, use it directly
        apiBody.lastEvaluatedKey = params.lastEvaluatedKey
      }
    }

    const response =
      await stakingApiClient.post<StakeContractListBackendResponse>(
        '/admin/stake/contracts/list',
        apiBody
      )
    return {
      message: response.data.msg || 'Success',
      body: {
        items: response.data.data.list || [],
        total: response.data.data.total || response.data.data.list?.length || 0,
        lastEvaluatedKey: response.data.data.lastEvaluatedKey,
      },
    }
  },

  getStakeContractById: async (
    contractId: string
  ): Promise<StakeContractResponse> => {
    const response = await stakingApiClient.get<StakeContractResponse>(
      `/admin/stake/contracts/${contractId}`
    )
    return response.data
  },

  createStakeContract: async (
    params: StakeContractCreateParams
  ): Promise<StakeContractResponse> => {
    const response = await stakingApiClient.post<StakeContractResponse>(
      '/admin/stake/contracts',
      params
    )
    return response.data
  },

  updateStakeContract: async (
    contractId: string,
    params: StakeContractUpdateParams
  ): Promise<StakeContractResponse> => {
    if (import.meta.env.DEV) {
      console.log('Updating contract with PUT method:', {
        contractId,
        endpoint: `/admin/stake/contracts/${contractId}`,
        params,
      })
    }
    const response = await stakingApiClient.put<StakeContractResponse>(
      `/admin/stake/contracts/${contractId}`,
      params
    )
    return response.data
  },

  // User Stake List methods
  listUserStakes: async (
    params: UserStakeListParams = {}
  ): Promise<UserStakeListResponse> => {
    const apiBody: Record<string, unknown> = {}

    if (params.limit !== undefined) {
      apiBody.limit = params.limit
    }

    if (params.status !== undefined) {
      apiBody.status = params.status
    }

    if (params.start_day !== undefined) {
      apiBody.start_day = params.start_day
    }

    if (params.end_day !== undefined) {
      apiBody.end_day = params.end_day
    }

    if (
      params.lastEvaluatedKey !== undefined &&
      params.lastEvaluatedKey !== null
    ) {
      // Parse string to object if needed - Axios will automatically stringify objects
      if (typeof params.lastEvaluatedKey === 'string') {
        try {
          // Try to parse the string as JSON to get object
          apiBody.lastEvaluatedKey = JSON.parse(params.lastEvaluatedKey)
        } catch {
          // If parsing fails, treat it as a plain string value wrapped in object
          apiBody.lastEvaluatedKey = {
            value: params.lastEvaluatedKey,
          }
        }
      } else {
        // Already an object, use it directly
        apiBody.lastEvaluatedKey = params.lastEvaluatedKey
      }
    }

    const response = await stakingApiClient.post<UserStakeListBackendResponse>(
      '/admin/stake/users/list',
      apiBody
    )
    return {
      message: response.data.msg || 'Success',
      body: {
        items: response.data.data.list || [],
        total: response.data.data.total || response.data.data.list?.length || 0,
        lastEvaluatedKey: response.data.data.lastEvaluatedKey,
      },
    }
  },

  // Change User Stake Status
  changeUserStakeStatus: async (
    usersStakeId: string,
    status: string
  ): Promise<BaseResponse<null>> => {
    const response = await stakingApiClient.post<BaseResponse<null>>(
      '/admin/stake/users/change-status',
      {
        usersStakeId,
        status,
      }
    )
    return response.data
  },

  // Get Total Users Stakes Info
  getTotalUsersStakesInfo: async (): Promise<TotalUsersStakesInfoResponse> => {
    const response = await stakingApiClient.get<{
      data: TotalUsersStakesInfo
      msg: string
      code: number
    }>('/admin/stake/users/total-stakes-info')
    return {
      message: response.data.msg || 'Success',
      body: response.data.data,
    }
  },
}
