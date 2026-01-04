import type { BaseResponse } from '../types/common.types'
import type {
  CreateJudgeLoanRequest,
  CreateLoanNoteRequest,
  DistrictListResponse,
  LoanListRequest,
  LoanListResponse,
  LoanNoteListRequest,
  LoanNoteListResponse,
  LoanNoteResponse,
  LoanResponse,
  LoanSummaryRequest,
  LoanSummaryResponse,
  UpdateCustomerAndLoanRequest,
} from '../types/loan.types'
import { apiClient } from './client'

export const loanService = {
  /**
   * Зээлийн жагсаалт авах
   */
  listLoans: async (
    params: LoanListRequest = {}
  ): Promise<LoanListResponse> => {
    const response = await apiClient.post<LoanListResponse>(
      '/loans/list',
      params
    )
    return response.data
  },

  /**
   * Зээлийн дэлгэрэнгүй мэдээлэл авах
   */
  getLoan: async (id: number): Promise<LoanResponse> => {
    const response = await apiClient.get<LoanResponse>(`/loans/${id}`)
    return response.data
  },

  /**
   * Зээлийн статистик мэдээлэл авах
   */
  getSummary: async (
    params: LoanSummaryRequest = {}
  ): Promise<LoanSummaryResponse> => {
    const response = await apiClient.post<LoanSummaryResponse>(
      '/loans/summary',
      params
    )
    return response.data
  },

  /**
   * Харилцагч болон зээлийн мэдээлэл шинэчлэх
   */
  updateCustomerAndLoan: async (
    loanId: number,
    data: UpdateCustomerAndLoanRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.put<BaseResponse<null>>(
      `/customer-and-loans/update/${loanId}`,
      data
    )
    return response.data
  },

  /**
   * Шүүхийн зээл үүсгэх
   */
  createJudgeLoan: async (
    data: CreateJudgeLoanRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      '/judge-loan/create',
      data
    )
    return response.data
  },

  /**
   * Дүүргүүдийн жагсаалт авах
   */
  getDistricts: async (): Promise<DistrictListResponse> => {
    const response = await apiClient.post<DistrictListResponse>(
      '/districts/list',
      {
        pageSize: 100,
      }
    )
    return response.data
  },

  /**
   * Тэмдэглэл нэмэх
   */
  createLoanNote: async (
    data: CreateLoanNoteRequest
  ): Promise<LoanNoteResponse> => {
    const response = await apiClient.post<LoanNoteResponse>(
      '/loan-notes/create',
      data
    )
    return response.data
  },

  /**
   * Зээлийн тэмдэглэлүүдийг авах
   */
  getLoanNotes: async (
    params: LoanNoteListRequest
  ): Promise<LoanNoteListResponse> => {
    const response = await apiClient.post<LoanNoteListResponse>(
      '/loan-notes/list',
      params
    )
    return response.data
  },
}
