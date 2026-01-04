import { z } from 'zod'
import type { BaseResponse } from './common.types'

// Customer schema
export const customerSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  registerNumber: z.string(),
  customerId: z.string(),
  phoneNumber: z.string(),
  job: z.string().optional(),
  jobName: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  khoroo: z.string().optional(),
  location: z.string().optional(),
  currentLocation: z.string().optional(),
  workLocation: z.string().optional(),
  additionalLocation: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Customer = z.infer<typeof customerSchema>

// Customer list schema
export const customerListSchema = z.array(customerSchema)
export type CustomerList = z.infer<typeof customerListSchema>

// Customer list request
export interface CustomerListRequest {
  current?: number
  pageSize?: number
  query?: string
  district?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Customer list response body
export interface CustomerListBody {
  list: Customer[]
  items: number // total count
}

// Customer list response
export interface CustomerListResponse extends BaseResponse<CustomerListBody> {}

// Get customer response - API returns 'data' instead of 'body'
export interface CustomerResponse {
  success: boolean
  message: string
  data: Customer | null
  code: number
}

// Update customer request
export interface UpdateCustomerRequest {
  location?: string
  currentLocation?: string
  workLocation?: string
  additionalLocation?: string
}

// Update customer response
export interface UpdateCustomerResponse extends BaseResponse<null> {}
