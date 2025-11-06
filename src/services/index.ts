// API Client
export { apiClient } from './api/client'

// Auth Service
export { authService } from './api/auth.service'

// KYC Service
export { kycService } from './api/kyc.service'

// Bank Service
export { bankService } from './api/bank.service'

// Common Types
export type { BaseResponse, PaginationResponse } from './types/common.types'

// Auth Types
export type {
  AdminUser,
  LoginCredentials,
  LoginResponse,
  LoginResponseBody,
  UserInfoResponse,
} from './types/auth.types'

export { KycInfoTypeEnum, userListSchema, userSchema } from './types/kyc.types'
export type {
  MetaData,
  Referral,
  User,
  UserList,
  UserListRequest,
  UserListResponse,
  UserListType,
  UserRole,
  UserStatus,
} from './types/kyc.types'

// Bank Types
export { depositListSchema, depositSchema } from './types/bank.types'
export type {
  Deposit,
  DepositList,
  DepositListRequest,
  DepositListResponse,
  DepositStatus,
} from './types/bank.types'

export { withdrawalListSchema, withdrawalSchema } from './types/bank.types'
export type {
  Withdrawal,
  WithdrawalList,
  WithdrawalListRequest,
  WithdrawalListResponse,
  WithdrawalStatus,
} from './types/bank.types'

export { walletListSchema, walletSchema } from './types/bank.types'
export type {
  Wallet,
  WalletList,
  WalletListRequest,
  WalletListResponse,
} from './types/bank.types'

export {
  cryptoDepositListSchema,
  cryptoDepositSchema,
} from './types/bank.types'
export type {
  CryptoDeposit,
  CryptoDepositList,
  CryptoDepositListRequest,
  CryptoDepositListResponse,
} from './types/bank.types'
