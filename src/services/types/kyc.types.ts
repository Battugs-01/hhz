import { z } from 'zod'
import type { BaseResponse, PaginationResponse } from './common.types'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])
export type UserRole = z.infer<typeof userRoleSchema>

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
export type UserList = z.infer<typeof userListSchema>

// API Request Types
export interface UserListRequest {
  current?: number
  pageSize?: number
  query?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

// API Response Types
export interface UserListResponse
  extends BaseResponse<PaginationResponse<User>> {}

export interface UserListType {
  id: string
  created_at: Date
  updated_at: Date
  email: string
  binanceEmail: string
  firstName: string
  lastName: string
  subAccountId: string
  canTrade: boolean
  canWithdraw: boolean
  isWhitelistEnabled: boolean
  kycLevel: number
  vipLevel: number
  status: number
  metaData: MetaData
}

export interface MetaData {
  referral: Referral
}

export interface Referral {
  referralCode: null
  referredBy: null
}

// Enums
export enum KycInfoTypeEnum {
  KycInfoTypeAccountNumber = 'account_number',
  KycInfoTypeUser = 'default_filter_by_user',
}
