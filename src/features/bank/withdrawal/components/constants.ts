import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'status',
  'currency',
  'txnId',
  'id',
  'totalAmount',
  'accountNumber',
] as const

export const WITHDRAWAL_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Withdrawal ID',
    type: 'text',
    placeholder: 'Enter withdrawal ID...',
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
    key: 'totalAmount',
    label: 'Total Amount',
    type: 'text',
    placeholder: 'Enter total amount...',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    type: 'text',
    placeholder: 'Enter account number...',
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
  WITHDRAWAL_LIST: 'withdrawal',
  WITHDRAWAL_DETAIL: 'withdrawal-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'withdrawal-table',
  EXPORT_FILE_NAME: 'withdrawals.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'id',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const

/**
 * Maps withdrawal status to badge variant
 * @param status - Withdrawal status string
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
