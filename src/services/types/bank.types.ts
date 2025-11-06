import { z } from 'zod'
import type { BaseResponse, PaginationResponse } from './common.types'

const depositStatusSchema = z.union([
  z.literal('TRANSFERRED'),
  z.literal('PENDING'),
  z.literal('COMPLETED'),
  z.literal('FAILED'),
  z.literal('CANCELLED'),
  z.string(), // Allow any string status
])
export type DepositStatus = z.infer<typeof depositStatusSchema>

const userSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  email: z.string().optional(),
  binanceEmail: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  subAccountId: z.string().optional(),
  canTrade: z.boolean().optional(),
  canWithdraw: z.boolean().optional(),
  isWhitelistEnabled: z.boolean().optional(),
  kycLevel: z.number().optional(),
  vipLevel: z.number().optional(),
  status: z.number().optional(),
  metaData: z.record(z.string(), z.unknown()).optional(),
})

export const depositSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  currency: z.string(),
  depositAmount: z.number(),
  email: z.string().optional(),
  paymentWalletId: z.string().optional(),
  status: depositStatusSchema,
  transferTime: z.string().optional(),
  txnAmount: z.number().optional(),
  txnId: z.string().optional(),
  userId: z.string(),
  User: userSchema.optional(),
})
export type Deposit = z.infer<typeof depositSchema>

export const depositListSchema = z.array(depositSchema)
export type DepositList = z.infer<typeof depositListSchema>

// API Request Types
export interface DepositListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  currency?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

// API Response Types
export interface DepositListResponse
  extends BaseResponse<PaginationResponse<Deposit>> {}

// ============================================
// WITHDRAWAL TYPES
// ============================================

const withdrawalStatusSchema = z.union([
  z.literal('TRANSFERRED'),
  z.literal('PENDING'),
  z.literal('COMPLETED'),
  z.literal('FAILED'),
  z.literal('CANCELLED'),
  z.string(), // Allow any string status
])
export type WithdrawalStatus = z.infer<typeof withdrawalStatusSchema>

const metadataSchema = z.object({
  serviceFee: z.number().optional(),
  serviceFeeTxnId: z.string().optional(),
  txnFee: z.number().optional(),
  txnFeeTxnId: z.string().optional(),
  txnTaskId: z.string().optional(),
})

const bankSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  code: z.string().optional(),
  clearingCode: z.string().optional(),
  nameEn: z.string().optional(),
  nameMn: z.string().optional(),
  icon: z.string().optional(),
  length: z.number().optional(),
  order: z.number().optional(),
  isEnabled: z.boolean().optional(),
})

export const walletSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  walletCode: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankId: z.string().optional(),
  iban: z.string().optional(),
  status: z.string().optional(),
  verifiedAt: z.string().optional(),
  userId: z.string().optional(),
  User: userSchema.optional(),
  Bank: bankSchema.nullable().optional(),
})

export const withdrawalSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  accountNumber: z.string().optional(),
  bankId: z.string().optional(),
  currency: z.string(),
  feeAmount: z.number().optional(),
  metadata: metadataSchema.optional(),
  walletId: z.string().optional(),
  Wallet: walletSchema.optional(),
  receiveAmount: z.number().optional(),
  status: withdrawalStatusSchema,
  totalAmount: z.number().optional(),
  transferTime: z.string().optional(),
  userId: z.string(),
  User: userSchema.optional(),
})
export type Withdrawal = z.infer<typeof withdrawalSchema>

export const withdrawalListSchema = z.array(withdrawalSchema)
export type WithdrawalList = z.infer<typeof withdrawalListSchema>

// API Request Types
export interface WithdrawalListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  currency?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

// API Response Types
export interface WithdrawalListResponse
  extends BaseResponse<PaginationResponse<Withdrawal>> {}

// ============================================
// WALLET TYPES
// ============================================

// Reuse the walletSchema from withdrawal types (already exported above)
export type Wallet = z.infer<typeof walletSchema>

export const walletListSchema = z.array(walletSchema)
export type WalletList = z.infer<typeof walletListSchema>

// API Request Types
export interface WalletListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  accountNumber?: string
  accountName?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

// API Response Types
export interface WalletListResponse
  extends BaseResponse<PaginationResponse<Wallet>> {}

// ============================================
// CRYPTO DEPOSIT TYPES
// ============================================

// Reuse deposit schema for crypto deposits (can be adjusted based on actual API response)
export const cryptoDepositSchema = depositSchema
export type CryptoDeposit = z.infer<typeof cryptoDepositSchema>

export const cryptoDepositListSchema = z.array(cryptoDepositSchema)
export type CryptoDepositList = z.infer<typeof cryptoDepositListSchema>

// API Request Types
export interface CryptoDepositListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  currency?: string
  txnId?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

// API Response Types
export interface CryptoDepositListResponse
  extends BaseResponse<PaginationResponse<CryptoDeposit>> {}
