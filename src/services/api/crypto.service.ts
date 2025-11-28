import type {
  CoinListParams,
  CoinListResponse,
  CoinResponse,
  CryptoDepositListRequest,
  CryptoDepositListResponse,
  CryptoWithdrawalListRequest,
  CryptoWithdrawalListResponse,
  WalletAddressListRequest,
  WalletAddressListResponse,
} from '../types/crypto.types'
import { apiClient } from './client'

export const cryptoService = {
  listCoins: async (params: CoinListParams): Promise<CoinListResponse> => {
    const response = await apiClient.post<CoinListResponse>(
      'crypto/coins/list',
      params
    )
    return response.data
  },

  getCoinById: async (id: string): Promise<CoinResponse> => {
    const response = await apiClient.get<CoinResponse>(`/coins/${id}`)
    return response.data
  },

  listCryptoDeposits: async (
    body: CryptoDepositListRequest = {}
  ): Promise<CryptoDepositListResponse> => {
    const response = await apiClient.post<CryptoDepositListResponse>(
      '/crypto/deposit-history/list',
      body
    )
    return response.data
  },

  listCryptoWithdrawals: async (
    body: CryptoWithdrawalListRequest = {}
  ): Promise<CryptoWithdrawalListResponse> => {
    const response = await apiClient.post<CryptoWithdrawalListResponse>(
      '/crypto/withdrawal-history/list',
      body
    )
    return response.data
  },

  listWalletAddresses: async (
    body: WalletAddressListRequest = {}
  ): Promise<WalletAddressListResponse> => {
    const response = await apiClient.post<WalletAddressListResponse>(
      '/crypto/wallet-addresses/list',
      body
    )
    return response.data
  },
  getUserDepositHistory: async (
    userId: string,
    body: Record<string, unknown> = {}
  ): Promise<CryptoDepositListResponse> => {
    const response = await apiClient.post<CryptoDepositListResponse>(
      `/crypto/deposit-history/${userId}`,
      body
    )
    return response.data
  },
  getUserWithdrawalHistory: async (
    userId: string,
    body: Record<string, unknown> = {}
  ): Promise<CryptoWithdrawalListResponse> => {
    const response = await apiClient.post<CryptoWithdrawalListResponse>(
      `/crypto/withdrawal-history/${userId}`,
      body
    )
    return response.data
  },
}
