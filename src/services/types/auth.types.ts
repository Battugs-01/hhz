export interface LoginCredentials {
  email: string
  password: string
}

export interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface LoginResponseData {
  token: string
  admin: AdminUser
}

export interface LoginResponse {
  success: boolean
  message: string
  data: LoginResponseData
  code: number
}

export interface UserInfoResponse {
  success: boolean
  message: string
  data: AdminUser
  code: number
}

export interface UpdatePasswordRequest {
  oldPassword: string
  password: string
}

export interface UpdatePasswordResponse {
  success: boolean
  message: string
  code: number
  data: AdminUser
}
