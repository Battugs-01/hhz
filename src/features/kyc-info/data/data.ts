import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { type UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: UserCheck,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: Users,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: CreditCard,
  },
] as const

export interface UserListRequest {
  current?: number
  pageSize?: number
  query?: string
  sortDate?: {
    end_day: string
    start_day: string
  }
}

export enum KycInfoTypeEnum {
  KycInfoTypeAccountNumber = 'account_number',
  KycInfoTypeUser = 'default_filter_by_user',
}

export interface UserListType {
  id: string
  created_at: Date
  updated_at: Date
  email: string
  binanceEmail: string
  firstName: string
  lastName: string
  subAccountId: string
  canTrade: boolean
  canWithdraw: boolean
  isWhitelistEnabled: boolean
  kycLevel: number
  vipLevel: number
  status: number
  metaData: MetaData
}

export interface MetaData {
  referral: Referral
}

export interface Referral {
  referralCode: null
  referredBy: null
}
