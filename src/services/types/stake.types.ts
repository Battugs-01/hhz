import { z } from 'zod'
import type { BaseResponse, PaginationResponse } from './common.types'

const stakeStatusSchema = z.union([
  z.literal('ACTIVE'),
  z.literal('PENDING'),
  z.literal('COMPLETED'),
  z.literal('CANCELLED'),
  z.literal('FAILED'),
  z.string(),
])
export type StakeStatus = z.infer<typeof stakeStatusSchema>

export enum USERS_STAKE_STATUS {
  ONGOING = 'ongoing',
  REDEEMED = 'redeemed',
  REDEEMABLE = 'redeemable',
  REDEEMING = 'redeeming',
  REDEEM_REQUESTED = 'redeem_requested',
  REDEEM_REQUESTED_MANUAL = 'redeem_requested_manual',
  CANCEL_REQUESTED = 'cancel_requested',
  CANCEL_REQUESTED_MANUAL = 'cancel_requested_manual',
  CANCELLING = 'cancelling',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

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

// User Stake List types (for /v3/user/stake/list)
export const userStakeListSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  stakeContractId: z.string().optional(),
  stakeStatus: z.string().optional(),
  stakedAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  rewardAmount: z.number().optional(),
  apr: z.number().optional(),
  asset: z.string(),
  assetImage: z.string().optional(),
  status: z.string().optional(),
  createTime: z.number().optional(),
  updateTime: z.number().optional(),
  cancelTime: z.number().optional(),
  metadata: z
    .object({
      history: z
        .array(
          z.object({
            binanceTxnId: z.string().optional(),
            txnId: z.string().optional(),
            timestamp: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
})
export type UserStakeList = z.infer<typeof userStakeListSchema>

export interface UserStakeListParams {
  limit?: number
  lastEvaluatedKey?: string | Record<string, unknown>
  status?: USERS_STAKE_STATUS
}

export interface UserStakeListBackendResponse {
  data: {
    list: UserStakeList[]
    total?: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }
  msg: string
  code: number
}

export interface UserStakeListResponse
  extends BaseResponse<{
    items: UserStakeList[]
    total: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }> {}

export const stakeSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  userId: z.string(),
  User: userSchema.optional(),
  currency: z.string(),
  stakeAmount: z.number(),
  rewardAmount: z.number().optional(),
  apy: z.number().optional(),
  duration: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: stakeStatusSchema,
  txnId: z.string().optional(),
  unlockDate: z.string().optional(),
})
export type Stake = z.infer<typeof stakeSchema>

export const stakeListSchema = z.array(stakeSchema)
export type StakeList = z.infer<typeof stakeListSchema>

export interface StakeListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  currency?: string
  userId?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

export interface StakeListResponse
  extends BaseResponse<PaginationResponse<Stake>> {}

// Stake Asset types
export const stakeAssetSchema = z.object({
  asset: z.string(),
  image: z.string().optional(),
  maxSize: z.number().optional(),
  status: z.string().optional(),
  termsAndConditions: z.string().optional(),
  stakeAssetTitle: z.string().optional(),
  stakeImage: z.string().optional(),
  createTime: z.number().optional(),
  updateTime: z.number().optional(),
  isEnabled: z.number().optional(),
  usedMaxSize: z.number().optional(),
  totalStakedAmountSize: z.number().optional(),
})
export type StakeAsset = z.infer<typeof stakeAssetSchema>

export const stakeAssetListSchema = z.array(stakeAssetSchema)
export type StakeAssetList = z.infer<typeof stakeAssetListSchema>

export interface StakeAssetCreateParams {
  image: string
  asset: string
  maxSize?: number
  status?: string
  termsAndConditions?: string
  stakeAssetTitle?: string
  stakeImage?: string
}

export interface StakeAssetUpdateParams {
  image?: string
  asset: string
  maxSize?: number
  status?: string
  termsAndConditions?: string
  stakeAssetTitle?: string
  stakeImage?: string
}

export interface StakeAssetListParams {
  lastEvaluatedKey?: string | Record<string, unknown>
}

export interface StakeAssetListBackendResponse {
  data: {
    list: StakeAsset[]
    total?: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }
  msg: string
  code: number
}

export interface StakeAssetResponse extends BaseResponse<StakeAsset> {}
export interface StakeAssetListResponse
  extends BaseResponse<{
    items: StakeAsset[]
    total: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }> {}

// Stake Contract types
export const cancelPolicySchema = z.object({
  fromDate: z.number(),
  toDate: z.number(),
  apr: z.number(),
})

export const stakeContractSchema = z.object({
  stakeContractId: z.string().optional(),
  contractId: z.string().optional(),
  duration: z.number(),
  apr: z.number().optional(),
  stakeContractName: z.string(),
  asset: z.string(),
  assetImage: z.string().optional(),
  minAmount: z.number(),
  maxAmount: z.number(),
  decimalPlaces: z.number().optional(),
  cancelPolicies: z.array(cancelPolicySchema).optional(),
  status: z.string().optional(),
  createTime: z.number().optional(),
  updateTime: z.number().optional(),
  totalStakedAmount: z.number().optional(),
  isEnabled: z.number().optional(),
})
export type StakeContract = z.infer<typeof stakeContractSchema>

export const stakeContractListSchema = z.array(stakeContractSchema)
export type StakeContractList = z.infer<typeof stakeContractListSchema>

export interface StakeContractCreateParams {
  duration: number
  apr?: number
  stakeContractName: string
  asset: string
  minAmount: number
  maxAmount: number
  decimalPlaces?: number
  cancelPolicies?: Array<{
    fromDate: number
    toDate: number
    apr: number
  }>
}

export interface StakeContractUpdateParams {
  duration?: number
  apr?: number
  stakeContractName?: string
  asset?: string
  minAmount?: number
  maxAmount?: number
  decimalPlaces?: number
  cancelPolicies?: Array<{
    fromDate: number
    toDate: number
    apr: number
  }>
}

export interface StakeContractListParams {
  lastEvaluatedKey?: string | Record<string, unknown>
}

export interface StakeContractListBackendResponse {
  data: {
    list: StakeContract[]
    total?: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }
  msg: string
  code: number
}

export interface StakeContractResponse extends BaseResponse<StakeContract> {}
export interface StakeContractListResponse
  extends BaseResponse<{
    items: StakeContract[]
    total: number
    lastEvaluatedKey?: string | Record<string, unknown>
  }> {}
