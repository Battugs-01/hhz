import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['status', 'currency', 'txnId', 'id'] as const

export const DEPOSIT_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Deposit ID',
    type: 'text',
    placeholder: 'Enter deposit ID...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Transferred', value: 'TRANSFERRED' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Failed', value: 'FAILED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ],
    placeholder: 'Select status...',
  },
  {
    key: 'currency',
    label: 'Currency',
    type: 'text',
    placeholder: 'Enter currency...',
  },
  {
    key: 'txnId',
    label: 'Transaction ID',
    type: 'text',
    placeholder: 'Enter transaction ID...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  DEPOSIT_LIST: 'deposit',
  DEPOSIT_DETAIL: 'deposit-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'deposit-table',
  EXPORT_FILE_NAME: 'deposits.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'id',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const

/**
 * Maps deposit status to badge variant
 * @param status - Deposit status string
 * @returns Badge variant ('success', 'error', or 'warning')
 */
export function getStatusVariant(
  status: string
): 'success' | 'error' | 'warning' {
  if (status === 'TRANSFERRED' || status === 'COMPLETED') {
    return 'success'
  }
  if (status === 'FAILED' || status === 'CANCELLED') {
    return 'error'
  }
  return 'warning'
}
