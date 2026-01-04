import { z } from 'zod'
import { Admin } from '..'
import type { BaseResponse } from './common.types'

// Loan schema - API response-д тохирсон
export const loanSchema = z.object({
  id: z.number(),
  loanId: z.string(), // "LOAN20240001" гэх мэт string
  registerNumber: z.string(),
  loanAmount: z.number(),
  closePayAmount: z.number(),
  customerId: z.number(),
  payAmount: z.number(),
  payInterest: z.number(),
  payExtraInterest: z.number(),
  overdueDay: z.number(),
  loanType: z.string(),
  loanDate: z.number(), // 20240101 гэх мэт number format
  description: z.string().optional(),
  status: z.string(), // Төлөв нэр
  statusId: z.number(),
  branchId: z.number(),
  economistId: z.number().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.number().optional(),
  customer: z.lazy(() => loanCustomerSchema).optional(),
})

export type Loan = z.infer<typeof loanSchema>

export const loanListSchema = z.array(loanSchema)
export type LoanList = z.infer<typeof loanListSchema>

// Customer schema
export const loanCustomerSchema = z.object({
  id: z.number(),
  registerNumber: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  customerId: z.string(),
  phoneNumber: z.string(),
  address: z.string().optional(),
  location: z.string().optional(),
  jobName: z.string().optional(),
  district: z.string().optional(),
  khoroo: z.string().optional(),
  job: z.string().optional(),
  additionalLocation: z.string().optional(),
  currentLocation: z.string().optional(),
  workLocation: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.number().optional(),
})

export type LoanCustomer = z.infer<typeof loanCustomerSchema>

// Request types
export interface LoanListRequest {
  current?: number
  pageSize?: number
  query?: string
  branchId?: number
  statusId?: number
  start_day?: string
  end_day?: string
}

// District type
export interface District {
  id: number
  districtMn: string
  districtEn?: string
  shortMn?: string
  shortEn?: string
  createdAt?: string
  updatedAt?: string
}

// District list response
export interface DistrictListBody {
  list: District[]
  items: number
}

export interface DistrictListResponse extends BaseResponse<DistrictListBody> {}

// Update customer and loan request
export interface UpdateCustomerAndLoanRequest {
  address?: string
  district?: string
  khoroo?: string
  location?: string
  currentLocation?: string
  workLocation?: string
  additionalLocation?: string
  statusId: number
}

// Create judge loan request
export interface CreateJudgeLoanRequest {
  loanId: number
  districtId: number
  judge: string
  judgeAssistant: string
  judgeAssistantPhoneNumber: string
  code: string
  invoiceNumber: string
  invoiceDate: string
  ordinance: string
  ordinanceAmount: number
  stampFeeAmount: number
  refundStampFeeAmount: number
  description: string
  closeStatusId: number
  invoicedDate: string
  requestedActionPage: string
  responsibleEmployee: string
}

// Response types
export interface LoanListBody {
  list: Loan[]
  items: number
}

export interface LoanListResponse extends BaseResponse<LoanListBody> {}

export interface LoanResponse extends BaseResponse<Loan> {}

// Loan summary types
export interface LoanSummary {
  totalLoans: number
  overdueLoans: number
  severelyOverdueLoans: number
  totalLoanAmount: number
  overdueAmount: number
  severelyOverdueAmount: number
  averageLoanAmount: number
  maxOverdueDays: number
  overdue1To30Days: number
  overdue31To90Days: number
  branch?: {
    id: number
    branch: string
    isActive: boolean
    createdAt?: string
    updatedAt?: string
  }
}

export interface LoanSummaryRequest {
  branchId?: number
}

// Summary API returns 'data' instead of 'body'
export interface LoanSummaryResponse {
  success: boolean
  message: string
  data: LoanSummary | null
  code: number
}

// Loan Note types
export interface CreateLoanNoteRequest {
  loanId: number
  customerId: number
  note: string
  isNear: boolean
}

export interface LoanNoteListRequest {
  loanId: number
  customerId?: number
  current?: number
  pageSize?: number
  query?: string
}

export interface LoanNote {
  id: number
  loanId: number
  customerId: number
  note: string
  isNear: boolean
  createdBy: number
  createdByAdmin?: Admin
  createdAt: string
  updatedAt: string
}

export interface LoanNoteListBody {
  list: LoanNote[]
  items: number
}

export interface LoanNoteResponse extends BaseResponse<LoanNote> {}

export interface LoanNoteListResponse extends BaseResponse<LoanNoteListBody> {}
