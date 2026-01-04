import { z } from 'zod'
import type { BaseResponse } from './common.types'

// Admin roles
export const adminRoleSchema = z.enum([
  'super_admin',
  'admin',
  'manager',
  'tag',
  'economist',
  'accountant',
])
export type AdminRole = z.infer<typeof adminRoleSchema>

export enum USER_ROLES {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  TAG = 'tag',
  ECONOMIST = 'economist',
  ACCOUNTANT = 'accountant',
}

// Admin schema
export const adminSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  role: adminRoleSchema,
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Admin = z.infer<typeof adminSchema>

// Admin list schema
export const adminListSchema = z.array(adminSchema)
export type AdminList = z.infer<typeof adminListSchema>

// Admin list request
export interface AdminListRequest {
  current?: number
  pageSize?: number
  query?: string
  role?: AdminRole
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Admin list response body
export interface AdminListBody {
  list: Admin[]
  items: number // total count
}

// Admin list response
export interface AdminListResponse extends BaseResponse<AdminListBody> {}

// Create admin request
export interface CreateAdminRequest {
  firstName: string
  lastName: string
  email: string
  role: AdminRole
  password: string
}

// Update admin request
export interface UpdateAdminRequest {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  role?: AdminRole
  password?: string
}

// Delete admin response
export interface DeleteAdminResponse {
  success: boolean
  message: string
  id: number
}
