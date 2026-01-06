import axios from 'axios'
import type { BaseResponse } from '../types/common.types'
import type {
  CreateJudgeLoanNoteRequest,
  CreateJudgeLoanRequest,
  CreateLoanNoteRequest,
  DistrictListResponse,
  GpsLocs,
  JudgeDashboardResponse,
  JudgeLoan,
  JudgeLoanListRequest,
  JudgeLoanListResponse,
  JudgeLoanNoteListRequest,
  JudgeLoanNoteListResponse,
  LoanListRequest,
  LoanListResponse,
  LoanNoteListRequest,
  LoanNoteListResponse,
  LoanNoteResponse,
  LoanResponse,
  LoanSummaryRequest,
  LoanSummaryResponse,
  UpdateCustomerAndLoanRequest,
  UpdateJudgeLoanRequest
} from '../types/loan.types'
import { apiClient } from './client'

export const loanService = {
  /**
   * Шүүхийн зээлийн жагсаалт авах
   */
  listJudgeLoans: async (
    params: JudgeLoanListRequest
  ): Promise<JudgeLoanListResponse> => {
    const response = await apiClient.post<JudgeLoanListResponse>(
      '/judge-loan/list',
      params
    )
    return response.data
  },

  /**
   * Шүүхийн зээлийн дэлгэрэнгүй авах
   */
  getJudgeLoan: async (id: number): Promise<BaseResponse<JudgeLoan>> => {
    const response = await apiClient.get<BaseResponse<JudgeLoan>>(
      `/judge-loan/${id}`
    )
    return response.data
  },

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
   * Шүүхийн зээл засах
   */
  updateJudgeLoan: async (
    data: UpdateJudgeLoanRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.put<BaseResponse<null>>(
      `/judge-loan/update/${data.id}`,
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
   * Шүүхийн зээлтэй дүүргүүдийн жагсаалт авах
   */
  getDistrictsWithJudgeLoans: async (params: {
    statusId?: number
  } = {}): Promise<DistrictListResponse> => {
    const response = await apiClient.post<DistrictListResponse>(
      '/districts/judge-loan-list',
      {
        pageSize: 100,
        ...params,
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

  /**
   * Шүүхийн зээлийн тэмдэглэл нэмэх
   */
  createJudgeLoanNote: async (
    data: CreateJudgeLoanNoteRequest
  ): Promise<BaseResponse<null>> => {
    const response = await apiClient.post<BaseResponse<null>>(
      '/judge-loan-notes/create',
      data
    )
    return response.data
  },

  /**
   * Шүүхийн зээлийн тэмдэглэлүүдийг авах
   */
  listJudgeLoanNotes: async (
    params: JudgeLoanNoteListRequest
  ): Promise<JudgeLoanNoteListResponse> => {
    const response = await apiClient.post<JudgeLoanNoteListResponse>(
      '/judge-loan-notes/list',
      params
    )
    return response.data
  },
  /**
   * Ажилчдын GPS байршил авах (Direct Navixy API)
   */
  getGpsLocations: async (): Promise<GpsLocs[]> => {
    const login = import.meta.env.VITE_NAV_USERNAME
    const password = import.meta.env.VITE_NAV_PASSWORD

    if (!login || !password) {
      console.warn('VITE_NAV_USERNAME or VITE_NAV_PASSWORD is missing')
      return []
    }

    const base = 'https://api.eu.navixy.com/v2'

    try {
      const { data } = await axios.get(`${base}/user/auth`, {
        params: { login, password },
      })

      const res = await axios.get(`${base}/tracker/list`, {
        params: { hash: data.hash },
      })

      if (res.data.success) {
        const locs: GpsLocs[] = []
        for (const item of res.data.list) {
          const loc = await axios.get(`${base}/tracker/get_state`, {
            params: { hash: data.hash, tracker_id: item.id },
          })
          if (loc.data?.state?.gps?.location) {
            locs.push({
              loc: loc.data.state.gps.location,
              label: item.label,
            })
          }
        }
        return locs
      }

      return []
    } catch (err: any) {
      console.error('GPS Fetch Error:', err.message)
      return []
    }
  },
  /**
   * Шүүхийн зээлийн статистик мэдээлэл авах
   */
  getJudgeDashboard: async (
    params: JudgeLoanListRequest
  ): Promise<JudgeDashboardResponse> => {
    const response = await apiClient.post<JudgeDashboardResponse>(
      '/judge-loan/dashboard',
      params
    )
    return response.data
  },
}
