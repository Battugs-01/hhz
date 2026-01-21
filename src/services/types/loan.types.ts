import { z } from 'zod'
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
  interestRate: z.number().int().positive().optional(),
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
  locationValid: z.boolean().nullable().optional(),
  currentValid: z.boolean().nullable().optional(),
  workValid: z.boolean().nullable().optional(),
  additionalValid: z.boolean().nullable().optional(),
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
  economistId?: number
  statusId?: number
  start_day?: string
  end_day?: string
  // New filter fields
  loanId?: string
  registerNumber?: string
  phoneNumber?: string
  loanAmount?: string
  loanAmount_operator?: string
  closePayAmount?: string
  closePayAmount_operator?: string
  payAmount?: string
  payAmount_operator?: string
  payInterest?: string
  payInterest_operator?: string
  overdueDay?: string
  overdueDay_operator?: string
}

// District type
export interface District {
  id: number
  districtMn: string
  districtEn?: string
  shortMn?: string
  shortEn?: string
  judgeLoanCount?: number
  createdAt?: string
  updatedAt?: string
}

// District list response
export interface DistrictListBody {
  list: District[]
  items: number
}

export type DistrictListResponse = BaseResponse<DistrictListBody>

// Update customer and loan request
export interface UpdateCustomerAndLoanRequest {
  address?: string
  district?: string
  khoroo?: string
  location?: string
  currentLocation?: string
  workLocation?: string
  additionalLocation?: string
  locationValid?: boolean
  currentValid?: boolean
  workValid?: boolean
  additionalValid?: boolean
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

// Update judge loan request
export interface UpdateJudgeLoanRequest {
  id: number
  districtId?: number
  judge?: string
  judgeAssistant?: string
  judgeAssistantPhoneNumber?: string
  code?: string
  invoiceNumber?: string
  invoiceDate?: string
  ordinance?: string
  ordinanceAmount?: number
  stampFeeAmount?: number
  refundStampFeeAmount?: number
  description?: string
  closeStatusId?: number
  invoicedDate?: string
  requestedActionPage?: string
  responsibleEmployee?: string
}

// Create loan note request
export interface CreateLoanNoteRequest {
  loanId: number
  customerId: number
  note: string
  isNear?: boolean
  fileId?: number
}

// Create judge loan note request
export interface CreateJudgeLoanNoteRequest {
  judgeLoanId: number
  customerId: number
  note: string
  isNear?: boolean
  fileId?: number
}

// Response types
export interface LoanListBody {
  list: Loan[]
  items: number
}

export type LoanListResponse = BaseResponse<LoanListBody>

export type LoanResponse = BaseResponse<Loan>

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

export interface LoanSummaryRequest extends LoanListRequest {
  branchId?: number
}

export interface JudgeDashboardBody {
  totalJudgeLoans: number
  activeJudge: number
  averageOverdueDay: number
  totalAmount: number
}

export interface JudgeDashboardResponse {
  success: boolean
  message: string
  data: JudgeDashboardBody | null
  code: number
}

// Summary API returns 'data' instead of 'body'
export interface LoanSummaryResponse {
  success: boolean
  message: string
  data: LoanSummary | null
  code: number
}

// Judge Loan schema
export const judgeLoanSchema = z.object({
  id: z.number(),
  loanId: z.number(),
  districtId: z.number(),
  judge: z.string(),
  judgeAssistant: z.string(),
  judgeAssistantPhoneNumber: z.string().optional(),
  code: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string().optional(),
  ordinance: z.string().optional(),
  ordinanceAmount: z.number().optional().catch(0),
  stampFeeAmount: z.number().optional().catch(0),
  refundStampFeeAmount: z.number().optional().catch(0),
  description: z.string().optional(),
  closeStatusId: z.number(),
  invoicedDate: z.string().optional(),
  requestedActionPage: z.string().optional(),
  responsibleEmployee: z.string().optional(),
  createdAt: z.coerce.date(),
  loan: loanSchema,
  district: z.object({
    id: z.number(),
    districtMn: z.string(),
    districtEn: z.string().optional(),
  }),
  closeStatus: z.object({
    id: z.number(),
    status: z.string(),
  }),
})

export type JudgeLoan = z.infer<typeof judgeLoanSchema>

export interface JudgeLoanListRequest {
  districtId?: number
  closeStatusId?: number
  current?: number
  pageSize?: number
  query?: string
  sortDate?: {
    startDate?: string
    endDate?: string
  }
  // String filters
  loanId?: string
  registerNumber?: string
  phoneNumber?: string
  judge?: string
  judgeAssistant?: string
  judgeAssistantPhoneNumber?: string
  code?: string
  invoiceNumber?: string
  requestedActionPage?: string
  responsibleEmployee?: string
  // Numeric filters with operators
  loanAmount?: string
  loanAmount_operator?: string
  closePayAmount?: string
  closePayAmount_operator?: string
  payAmount?: string
  payAmount_operator?: string
  payInterest?: string
  payInterest_operator?: string
  overdueDay?: string
  overdueDay_operator?: string
  ordinanceAmount?: number
  ordinanceAmount_operator?: string
  stampFeeAmount?: number
  stampFeeAmount_operator?: string
  refundStampFeeAmount?: number
  refundStampFeeAmount_operator?: string
}

export interface JudgeLoanListBody {
  list: JudgeLoan[]
  items: number
}


export type JudgeLoanListResponse = BaseResponse<JudgeLoanListBody>

export interface Locs {
  lat: number
  lng: number
}

export interface GpsLocs {
  loc: Locs
  label: string
}
