import type {
    JudgeLoanReportRequest,
    JudgeLoanReportResponse,
    JudgeLoansReportDashboardResponse,
    LoanReportDashboardResponse,
    LoanReportRequest,
    LoanReportResponse,
} from '../types/report.types'
import { apiClient } from './client'

export const reportService = {
  getLoanReport: async (
    params: LoanReportRequest
  ): Promise<LoanReportResponse> => {
    const response = await apiClient.post<LoanReportResponse>(
      '/report/loan-list',
      params
    )
    return response.data
  },


  getJudgeLoanReport: async (
    params: JudgeLoanReportRequest
  ): Promise<JudgeLoanReportResponse> => {
    const response = await apiClient.post<JudgeLoanReportResponse>(
      '/report/judge-loan-list',
      params
    )
    return response.data
  },

  getLoanDashboard: async (
    params: LoanReportRequest
  ): Promise<LoanReportDashboardResponse> => {
    const response = await apiClient.post<LoanReportDashboardResponse>(
      '/report/loan-dashboard',
      params
    )
    return response.data
  },

  getJudgeLoanDashboard: async (
    params: JudgeLoanReportRequest
  ): Promise<JudgeLoansReportDashboardResponse> => {
    const response = await apiClient.post<JudgeLoansReportDashboardResponse>(
      '/report/judge-loan-dashboard',
      params
    )
    return response.data
  },
}
