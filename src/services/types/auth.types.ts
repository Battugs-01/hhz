import type { BaseResponse } from './common.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AdminUser {
  id: string
  email: string
  adminGroupId: string
  adminGroup: any
  status: string
  isEnabled: boolean
  userCreateDate: string
  password: string
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export interface LoginResponseBody {
  token: string
  adminUser: AdminUser
}

export interface LoginResponse extends BaseResponse<LoginResponseBody> {}

export interface UserInfoResponse extends BaseResponse<AdminUser> {}
