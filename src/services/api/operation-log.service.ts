import type {
  OperationLogListRequest,
  OperationLogListResponse,
} from '../types/operation-log.types'
import { apiClient } from './client'

export const operationLogService = {
  /**
   * Операцийн лог жагсаалт авах
   */
  listOperationLogs: async (
    params: OperationLogListRequest = {}
  ): Promise<OperationLogListResponse> => {
    const response = await apiClient.post<OperationLogListResponse>(
      '/operation-logs/list',
      params
    )
    return response.data
  },
}
