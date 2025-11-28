import type {
  DepositListResponse,
  ExchangeTxnListResponse,
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
  listExchangeTxn: async (
    body: Record<string, unknown> = {}
  ): Promise<ExchangeTxnListResponse> => {
    const response = await apiClient.post<ExchangeTxnListResponse>(
      '/banks/exchange-txn-task/list',
      body
    )
    return response.data
  },
  getUserDepositHistory: async (
    userId: string,
    body: Record<string, unknown> = {}
  ): Promise<DepositListResponse> => {
    const response = await apiClient.post<DepositListResponse>(
      `/banks/deposit-history/${userId}`,
      body
    )
    return response.data
  },
  getUserWithdrawalHistory: async (
    userId: string,
    body: Record<string, unknown> = {}
  ): Promise<WithdrawalListResponse> => {
    const response = await apiClient.post<WithdrawalListResponse>(
      `/banks/withdrawal-history/${userId}`,
      body
    )
    return response.data
  },
}
