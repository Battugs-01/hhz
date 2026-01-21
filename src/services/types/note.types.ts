import type { Admin } from './admin.types'
import type { BaseResponse } from './common.types'
import type { Customer } from './customer.types'
import type { JudgeLoan, Loan } from './loan.types'

export type AppFile = {
  id: number
  fileName: string
  originalName: string
  physicalPath: string
  extension: string
  fileSize: string
  createdAt: string
  updatedAt: string
}

export type LoanNote = {
  id: number
  note: string
  loanId: number
  customerId: number
  createdBy: number
  isNear: boolean
  fileId?: number
  file?: AppFile
  customer: Customer
  loan: Loan
  createdByAdmin: Admin
  createdAt: string
  updatedAt: string
}

export interface LoanNoteListRequest {
  current?: number
  pageSize?: number
  query?: string
  loanId?: number
  customerId?: number
  createdBy?: number
  phoneNumber?: string
  registerNumber?: string
  isNear?: boolean
  sortDate?: {
    startDate?: string
    endDate?: string
  }
}

export interface LoanNoteListBody {
  list: LoanNote[]
  items: number
}

export type LoanNoteListResponse = BaseResponse<LoanNoteListBody>

export type JudgeLoanNote = {
  id: number
  note: string
  judgeLoanId: number
  customerId: number
  createdBy: number
  fileId?: number
  file?: AppFile
  customer: Customer
  judgeLoan: JudgeLoan
  createdByAdmin: Admin
  createdAt: string
  updatedAt: string
}

export interface JudgeLoanNoteListRequest {
  current?: number
  pageSize?: number
  query?: string
  judgeLoanId?: number
  customerId?: number
  createdBy?: number
  phoneNumber?: string
  registerNumber?: string
  sortDate?: {
    startDate?: string
    endDate?: string
  }
}

export interface JudgeLoanNoteListBody {
  list: JudgeLoanNote[]
  items: number
}

export type JudgeLoanNoteListResponse = BaseResponse<JudgeLoanNoteListBody>
