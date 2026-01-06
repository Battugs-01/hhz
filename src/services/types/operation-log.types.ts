import type { Admin } from './admin.types'
import type { BaseResponse } from './common.types'

export interface OperationLog {
  id: number
  method: string
  deviceType: string
  ipAddress: string
  requestUrl: string
  statusCode: number
  type: string
  userId: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  requestBody: any
  responseBody: any
  user: Admin | null
  [key: string]: any
}

export interface OperationLogListRequest {
  current?: number
  pageSize?: number
  query?: string
}

export interface OperationLogListBody {
  list: OperationLog[]
  items: number
}

export type OperationLogListResponse = BaseResponse<OperationLogListBody>
