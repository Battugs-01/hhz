import type {
  CryptoDepositListResponse,
  DepositListResponse,
  WalletListResponse,
  WithdrawalListResponse,
} from '../types/bank.types'
import { apiClient } from './client'

export const bankService = {
  listDeposits: async (
    body: Record<string, unknown> = {}
  ): Promise<DepositListResponse> => {
    const response = await apiClient.post<DepositListResponse>(
      '/banks/deposits/list',
      body
    )
    return response.data
  },
  listWithdrawals: async (
    body: Record<string, unknown> = {}
  ): Promise<WithdrawalListResponse> => {
    const response = await apiClient.post<WithdrawalListResponse>(
      '/banks/withdrawals/list',
      body
    )
    return response.data
  },
  listWallets: async (
    body: Record<string, unknown> = {}
  ): Promise<WalletListResponse> => {
    const response = await apiClient.post<WalletListResponse>(
      '/banks/user-bank-account-wallets/list',
      body
    )
    return response.data
  },
  listCryptoDeposits: async (
    body: Record<string, unknown> = {}
  ): Promise<CryptoDepositListResponse> => {
    const response = await apiClient.post<CryptoDepositListResponse>(
      '/crypto/deposit-history/list',
      body
    )
    return response.data
  },
}
