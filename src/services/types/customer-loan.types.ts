import { z } from 'zod'
import type { BaseResponse } from './common.types'

export const customerLoanItemSchema = z.object({
  registerNumber: z.string(),
  phoneNumber: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  customerId: z.string(),
  job: z.string().optional(),
  jobName: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  khoroo: z.string().optional(),
  location: z.string().optional(),
  currentLocation: z.string().optional(),
  workLocation: z.string().optional(),
  additionalLocation: z.string().optional(),
  loanId: z.string(),
  loanAmount: z.number(),
  closePayAmount: z.number(),
  payAmount: z.number(),
  payInterest: z.number(),
  payExtraInterest: z.number(),
  overdueDay: z.number(),
  loanType: z.string(),
  loanDate: z.number(),
  description: z.string().optional(),
  status: z.string(),
  economistId: z.number().optional(),
})

export type CustomerLoanItem = z.infer<typeof customerLoanItemSchema>

export interface CreateCustomerAndLoansRequest {
  branchId: number
  list: CustomerLoanItem[]
}

export interface CreateCustomerAndLoansResponse extends BaseResponse<null> {}
