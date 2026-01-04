import { z } from 'zod'
import type { BaseResponse } from './common.types'

// Judge Close Status schema
export const judgeCloseStatusSchema = z.object({
  id: z.number(),
  status: z.string(),
  description: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type JudgeCloseStatus = z.infer<typeof judgeCloseStatusSchema>

// List schema
export const judgeCloseStatusListSchema = z.array(judgeCloseStatusSchema)
export type JudgeCloseStatusList = z.infer<typeof judgeCloseStatusListSchema>

// Request types
export interface JudgeCloseStatusListRequest {
  current?: number
  pageSize?: number
  query?: string
}

export interface CreateJudgeCloseStatusRequest {
  status: string
  description: string
  isActive: boolean
}

export interface UpdateJudgeCloseStatusRequest {
  id: number
  status: string
  description: string
  isActive: boolean
}

// Response types
export interface JudgeCloseStatusListBody {
  list: JudgeCloseStatus[]
  items: number
}

export interface JudgeCloseStatusListResponse
  extends BaseResponse<JudgeCloseStatusListBody> {}

export interface JudgeCloseStatusResponse
  extends BaseResponse<JudgeCloseStatus> {}

export interface DeleteJudgeCloseStatusResponse extends BaseResponse<null> {}
