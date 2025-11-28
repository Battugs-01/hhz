import { z } from 'zod'
import type { BaseResponse, PaginationResponse } from './common.types'

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

const networkSchema = z.object({
  addressRegex: z.string().optional(),
  addressRule: z.string().optional(),
  busy: z.boolean().optional(),
  coin: z.string().optional(),
  country: z.string().optional(),
  depositDesc: z.string().optional(),
  depositEnable: z.boolean().optional(),
  entityTag: z.string().optional(),
  estimatedArrivalTime: z.number().optional(),
  isDefault: z.boolean().optional(),
  memoRegex: z.string().optional(),
  minConfirm: z.number().optional(),
  name: z.string().optional(),
  network: z.string().optional(),
  resetAddressStatus: z.boolean().optional(),
  sameAddress: z.boolean().optional(),
  specialTips: z.string().optional(),
  specialWithdrawTips: z.string().optional(),
  totalWithdrawFee: z.string().optional(),
  totalWithdrawMin: z.string().optional(),
  unLockConfirm: z.number().optional(),
  withdrawDesc: z.string().optional(),
  withdrawEnable: z.boolean().optional(),
  withdrawFee: z.string().optional(),
  withdrawIntegerMultiple: z.string().optional(),
  withdrawMax: z.string().optional(),
  withdrawMin: z.string().optional(),
})

export const coinSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  coin: z.string(),
  name: z.string(),
  image: z.string().optional(),
  imageName: z.string().optional(),
  isEnabled: z.number(),
  isFeatured: z.number(),
  isLegalMoney: z.boolean().optional(),
  depositAllEnable: z.boolean().optional(),
  withdrawAllEnable: z.boolean().optional(),
  trading: z.boolean().optional(),
  networkList: z.array(networkSchema).optional(),
})
export type Coin = z.infer<typeof coinSchema>
export type Network = z.infer<typeof networkSchema>

export const coinListSchema = z.array(coinSchema)
export type CoinList = z.infer<typeof coinListSchema>

export interface CoinListParams {
  current?: number
  pageSize?: number
  query?: string
  symbol?: string
  trading?: boolean
  deposit?: boolean
  withdrawals?: boolean
}

export interface CoinListResponse
  extends BaseResponse<PaginationResponse<Coin>> {}
export interface CoinResponse extends BaseResponse<Coin> {}

// Crypto Deposit and Withdrawal types
export const cryptoDepositSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  currency: z.string(),
  depositAmount: z.number(),
  email: z.string().optional(),
  paymentWalletId: z.string().optional(),
  status: z.union([
    z.literal('TRANSFERRED'),
    z.literal('PENDING'),
    z.literal('COMPLETED'),
    z.literal('FAILED'),
    z.literal('CANCELLED'),
    z.string(),
  ]),
  transferTime: z.string().optional(),
  txnAmount: z.number().optional(),
  txnId: z.string().optional(),
  userId: z.string(),
  User: userSchema.optional(),
  address: z
    .object({
      address: z.string().optional(),
    })
    .optional(),
  sourceAddress: z.string().optional(),
})
export type CryptoDeposit = z.infer<typeof cryptoDepositSchema>

export const cryptoDepositListSchema = z.array(cryptoDepositSchema)
export type CryptoDepositList = z.infer<typeof cryptoDepositListSchema>

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

export interface CryptoDepositListResponse
  extends BaseResponse<PaginationResponse<CryptoDeposit>> {}

// Crypto Withdrawal schema
export const cryptoWithdrawalSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  userId: z.string(),
  User: userSchema.optional(),
  address: z.string().optional(),
  addressTag: z.string().nullable().optional(),
  amount: z.number(),
  receiveAmount: z.number().optional(),
  transferAmount: z.number().optional(),
  BWFee: z.number().optional(),
  SWFee: z.number().optional(),
  coinId: z.string().optional(),
  coin: coinSchema.optional(),
  network: z.string().optional(),
  status: z.number(),
  confirmTimes: z.number().nullable().optional(),
  txnId: z.string().optional(),
  sourceAddress: z.string().nullable().optional(),
  usdtValuation: z.number().optional(),
  transferStatus: z.string().nullable().optional(),
  transferTime: z.string().optional(),
  selfReturnStatus: z.string().nullable().optional(),
  transferType: z.string().nullable().optional(),
  metadata: z
    .object({
      receiverName: z.string().optional(),
      transferPurpose: z.string().optional(),
      transferSource: z.string().optional(),
      walletType: z.string().optional(),
    })
    .optional(),
  fetchedAt: z.string().nullable().optional(),
  insertTime: z.string().optional(),
})
export type CryptoWithdrawal = z.infer<typeof cryptoWithdrawalSchema>

export const cryptoWithdrawalListSchema = z.array(cryptoWithdrawalSchema)
export type CryptoWithdrawalList = z.infer<typeof cryptoWithdrawalListSchema>

export interface CryptoWithdrawalListRequest {
  current?: number
  pageSize?: number
  query?: string
  status?: string
  coin?: string
  network?: string
  txId?: string
  amount?: number
  amountCondition?: string
  usdtValuation?: number
  usdtValuationCondition?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

export interface CryptoWithdrawalListResponse
  extends BaseResponse<PaginationResponse<CryptoWithdrawal>> {}

// Wallet Address types
export const walletAddressSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  userId: z.string(),
  User: userSchema.optional(),
  address: z.string().optional(),
  coin: z.string().optional(),
  coinNetwork: z.string().optional(),
  isDefault: z.boolean().optional(),
  network: z.string().optional(),
  tag: z.string().optional(),
  url: z.string().optional(),
})
export type WalletAddress = z.infer<typeof walletAddressSchema>

export const walletAddressListSchema = z.array(walletAddressSchema)
export type WalletAddressList = z.infer<typeof walletAddressListSchema>

export interface WalletAddressListRequest {
  current?: number
  pageSize?: number
  query?: string
  coin?: string
  network?: string
  userId?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

export interface WalletAddressListResponse
  extends BaseResponse<PaginationResponse<WalletAddress>> {}
