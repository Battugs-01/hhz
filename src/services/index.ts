export { adminService } from './api/admin.service'
export { authService } from './api/auth.service'
export { branchService } from './api/branch.service'
export { apiClient } from './api/client'
export { customerLoanService } from './api/customer-loan.service'
export { customerService } from './api/customer.service'
export { economistService } from './api/economist.service'
export { judgeCloseStatusService } from './api/judge-close-status.service'
export { loanStatusService } from './api/loan-status.service'
export { loanService } from './api/loan.service'
export { operationLogService } from './api/operation-log.service'
export { reportService } from './api/report.service'

export type * from './types/report.types'

export type { BaseResponse, PaginationResponse } from './types/common.types'

export { adminListSchema, adminSchema, USER_ROLES } from './types/admin.types'
export type {
  Admin,
  AdminList,
  AdminListRequest,
  AdminListResponse,
  AdminRole,
  CreateAdminRequest,
  DeleteAdminResponse,
  UpdateAdminRequest
} from './types/admin.types'

export type {
  AdminUser,
  LoginCredentials,
  LoginResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UserInfoResponse
} from './types/auth.types'

export { branchListSchema, branchSchema } from './types/branch.types'
export type {
  Branch,
  BranchList,
  BranchListRequest,
  BranchListResponse,
  BranchResponse,
  CreateBranchRequest,
  DeleteBranchResponse,
  UpdateBranchRequest
} from './types/branch.types'

export { customerListSchema, customerSchema } from './types/customer.types'
export type {
  Customer,
  CustomerList,
  CustomerListRequest,
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse
} from './types/customer.types'

export { customerLoanItemSchema } from './types/customer-loan.types'
export type {
  CreateCustomerAndLoansRequest,
  CreateCustomerAndLoansResponse,
  CustomerLoanItem
} from './types/customer-loan.types'

export { economistListSchema, economistSchema } from './types/economist.types'
export type {
  CreateEconomistRequest,
  DeleteEconomistResponse,
  Economist,
  EconomistList,
  EconomistListRequest,
  EconomistListResponse,
  EconomistResponse,
  UpdateEconomistRequest
} from './types/economist.types'

export {
  judgeCloseStatusListSchema,
  judgeCloseStatusSchema
} from './types/judge-close-status.types'
export type {
  CreateJudgeCloseStatusRequest,
  DeleteJudgeCloseStatusResponse,
  JudgeCloseStatus,
  JudgeCloseStatusList,
  JudgeCloseStatusListRequest,
  JudgeCloseStatusListResponse,
  JudgeCloseStatusResponse,
  UpdateJudgeCloseStatusRequest
} from './types/judge-close-status.types'

export { loanStatusSchema } from './types/loan-status.types'
export type {
  CreateLoanStatusRequest,
  LoanStatus,
  LoanStatusListRequest,
  LoanStatusListResponse,
  LoanStatusResponse,
  UpdateLoanStatusRequest
} from './types/loan-status.types'

export {
  loanCustomerSchema,
  loanListSchema,
  loanSchema
} from './types/loan.types'
export type {
  CreateJudgeLoanNoteRequest,
  CreateJudgeLoanRequest,
  CreateLoanNoteRequest,
  District, GpsLocs, JudgeLoan,
  JudgeLoanListRequest,
  JudgeLoanListResponse,
  JudgeLoanNote,
  JudgeLoanNoteListRequest,
  JudgeLoanNoteListResponse,
  Loan,
  LoanCustomer,
  LoanList,
  LoanListRequest,
  LoanListResponse,
  LoanNote,
  LoanNoteListBody,
  LoanNoteListRequest,
  LoanNoteListResponse,
  LoanNoteResponse,
  LoanResponse,
  LoanSummary, Locs,
  UpdateCustomerAndLoanRequest
} from './types/loan.types'


export type {
  OperationLog,
  OperationLogListBody,
  OperationLogListRequest,
  OperationLogListResponse
} from './types/operation-log.types'
