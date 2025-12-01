export { authService } from './api/auth.service'
export { bankService } from './api/bank.service'
export { apiClient } from './api/client'
export { cryptoService } from './api/crypto.service'
export { kycService } from './api/kyc.service'
export { newsService } from './api/news.service'
export { stakeService } from './api/stake.service'
export { TakeActionService } from './api/takeAction.service'

export type { BaseResponse, PaginationResponse } from './types/common.types'

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

export { exchangeTxnListSchema, exchangeTxnSchema } from './types/bank.types'
export type {
  ExchangeTxn,
  ExchangeTxnList,
  ExchangeTxnListRequest,
  ExchangeTxnListResponse,
} from './types/bank.types'

export { stakeListSchema, stakeSchema } from './types/stake.types'
export type {
  Stake,
  StakeList,
  StakeListRequest,
  StakeListResponse,
  StakeStatus,
} from './types/stake.types'

export { stakeAssetListSchema, stakeAssetSchema } from './types/stake.types'
export type {
  StakeAsset,
  StakeAssetCreateParams,
  StakeAssetList,
  StakeAssetListParams,
  StakeAssetListResponse,
  StakeAssetResponse,
  StakeAssetUpdateParams,
} from './types/stake.types'

export {
  stakeContractListSchema,
  stakeContractSchema,
} from './types/stake.types'
export type {
  StakeContract,
  StakeContractCreateParams,
  StakeContractList,
  StakeContractListParams,
  StakeContractListResponse,
  StakeContractResponse,
  StakeContractUpdateParams,
} from './types/stake.types'

export { USERS_STAKE_STATUS, userStakeListSchema } from './types/stake.types'
export type {
  UserStakeList,
  UserStakeListParams,
  UserStakeListResponse,
} from './types/stake.types'

export {
  coinListSchema,
  coinSchema,
  cryptoDepositListSchema,
  cryptoDepositSchema,
  cryptoWithdrawalListSchema,
  cryptoWithdrawalSchema,
  walletAddressListSchema,
  walletAddressSchema,
} from './types/crypto.types'
export type {
  Coin,
  CoinList,
  CoinListParams,
  CoinListResponse,
  CoinResponse,
  CryptoDeposit,
  CryptoDepositList,
  CryptoDepositListRequest,
  CryptoDepositListResponse,
  CryptoWithdrawal,
  CryptoWithdrawalList,
  CryptoWithdrawalListRequest,
  CryptoWithdrawalListResponse,
  Network,
  WalletAddress,
  WalletAddressList,
  WalletAddressListRequest,
  WalletAddressListResponse,
} from './types/crypto.types'

export {
  newsApiResponseSchema,
  newsListSchema,
  newsSchema,
  transformNewsApiResponse,
  transformNewsToApiRequest,
} from './types/news.types'
export type {
  News,
  NewsCreateParams,
  NewsList,
  NewsListRequest,
  NewsListResponse,
  NewsResponse,
  NewsUpdateParams,
} from './types/news.types'

export type { 
  TakeAction 
  
} from './types/takeAction.types'
