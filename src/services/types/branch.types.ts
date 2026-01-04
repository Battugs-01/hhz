import { z } from 'zod'
import type { BaseResponse } from './common.types'

// Branch schema
export const branchSchema = z.object({
  id: z.number(),
  branch: z.string(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Branch = z.infer<typeof branchSchema>

// Branch list schema
export const branchListSchema = z.array(branchSchema)
export type BranchList = z.infer<typeof branchListSchema>

// Branch list request
export interface BranchListRequest {
  current?: number
  pageSize?: number
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Branch list response body
export interface BranchListBody {
  list: Branch[]
  items: number // total count
}

// Branch list response
export interface BranchListResponse extends BaseResponse<BranchListBody> {}

// Create branch request
export interface CreateBranchRequest {
  branch: string
  isActive: boolean
}

// Update branch request
export interface UpdateBranchRequest {
  id: number
  branch?: string
  isActive?: boolean
}

// Delete branch response
export interface DeleteBranchResponse {
  success: boolean
  message: string
  id: number
}

// Get branch response
export interface BranchResponse extends BaseResponse<Branch> {}
