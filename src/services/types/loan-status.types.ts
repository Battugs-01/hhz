import { z } from 'zod'
import type { BaseResponse } from './common.types'

export const loanStatusSchema = z.object({
  id: z.number(),
  status: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type LoanStatus = z.infer<typeof loanStatusSchema>

export interface LoanStatusListRequest {
  current?: number
  pageSize?: number
  query?: string
  start_day?: string
  end_day?: string
}

export interface LoanStatusListBody {
  list: LoanStatus[]
  items: number
}

export interface LoanStatusListResponse
  extends BaseResponse<LoanStatusListBody> {}

export interface LoanStatusResponse extends BaseResponse<LoanStatus> {}

export interface CreateLoanStatusRequest {
  status: string
  description: string
}

export interface UpdateLoanStatusRequest {
  status?: string
  description?: string
}
