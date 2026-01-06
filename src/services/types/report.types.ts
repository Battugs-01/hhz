import type { BaseResponse } from './common.types'
import type { JudgeLoan, Loan } from './loan.types'

// Loan Report Request
export interface LoanReportRequest {
  current?: number
  pageSize?: number
  branchId?: number
  loanAmount?: string
  loanAmount_operator?: string
  overdueDay?: string
  overdueDay_operator?: string
  // Add other filters as needed to match LoanListRequest logic if reused
}

// Judge Loan Report Request
export interface JudgeLoanReportRequest {
  current?: number
  pageSize?: number
  districtId?: number
  judge?: string
  ordinanceAmount?: number
  ordinanceAmount_operator?: string
  // Add other filters as needed
}

// Responses
export interface LoanReportBody {
  list: Loan[]
  items: number
}

export type LoanReportResponse = BaseResponse<LoanReportBody>

export interface JudgeLoanReportBody {
  list: JudgeLoan[]
  items: number
}


export type JudgeLoanReportResponse = BaseResponse<JudgeLoanReportBody>

// Dashboard Stats
export interface ReportDashboardBody {
  totalNotes: number
  totalCustomer: number
}

export interface DashboardResponse<T> {
  success: boolean
  message: string
  code: number
  data: T
}

export type LoanReportDashboardResponse = DashboardResponse<ReportDashboardBody>
export type JudgeLoansReportDashboardResponse = DashboardResponse<ReportDashboardBody>
