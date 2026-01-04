import { z } from 'zod'
import type { BaseResponse } from './common.types'

// Economist schema
export const economistSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Economist = z.infer<typeof economistSchema>

// Economist list schema
export const economistListSchema = z.array(economistSchema)
export type EconomistList = z.infer<typeof economistListSchema>

// Economist list request
export interface EconomistListRequest {
  current?: number
  pageSize?: number
  query?: string
  isActive?: boolean
}

// Economist list response body
export interface EconomistListBody {
  list: Economist[]
  items: number
}

// Economist list response
export interface EconomistListResponse
  extends BaseResponse<EconomistListBody> {}

// Single economist response
export interface EconomistResponse extends BaseResponse<Economist> {}

// Create economist request
export interface CreateEconomistRequest {
  name: string
  description?: string
  isActive: boolean
}

// Update economist request
export interface UpdateEconomistRequest {
  id: number
  name?: string
  description?: string
  isActive?: boolean
}

// Delete economist response
export interface DeleteEconomistResponse {
  success: boolean
  message: string
  id: number
}
