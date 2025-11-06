import { type UserStatus } from '@/services/types/kyc.types'
import { CreditCard, Shield, UserCheck, Users } from 'lucide-react'

/**
 * UserStatus → CSS classes mapping
 * Badge styling-д ашиглана
 */
export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

/**
 * Status options для filter
 */
export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' },
] as const

/**
 * Role options для select/dropdown
 */
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

/**
 * React Query query keys
 */
export const QUERY_KEYS = {
  USER_INFORMATION_LIST: 'user-information',
  USER_INFORMATION_DETAIL: 'user-information-detail',
} as const
