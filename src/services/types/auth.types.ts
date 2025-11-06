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

export interface MFAChallengeResponseBody {
  challengeName: string
  session: string
  username: string
  adminUser: AdminUser
}

export interface LoginResponse
  extends BaseResponse<LoginResponseBody | MFAChallengeResponseBody> {}

export interface VerifyOTPCredentials {
  session: string
  username: string
  code: string
}

export interface VerifyOTPResponseBody {
  accessToken: string
  idToken: string // JWT token, middleware-д ашиглана
  refreshToken: string
  expiresIn: number
  adminUser: AdminUser
}

export interface VerifyOTPResponse
  extends BaseResponse<VerifyOTPResponseBody> {}

export interface UserInfoResponse extends BaseResponse<AdminUser> {}
