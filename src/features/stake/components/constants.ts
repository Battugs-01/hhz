import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['status', 'currency', 'userId', 'id'] as const

export const STAKE_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Stake ID',
    type: 'text',
    placeholder: 'Enter stake ID...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Completed', value: 'completed' },
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
    key: 'userId',
    label: 'User ID',
    type: 'text',
    placeholder: 'Enter user ID...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  STAKE_LIST: 'stake',
  STAKE_DETAIL: 'stake-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'stake-table',
  EXPORT_FILE_NAME: 'stakes.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'id',
  SEARCH_PLACEHOLDER: 'Search by Stake ID, User ID, or Email',
} as const

export function getStatusVariant(
  status: string
): 'success' | 'error' | 'warning' {
  if (status === 'ACTIVE' || status === 'COMPLETED') {
    return 'success'
  }
  if (status === 'FAILED' || status === 'CANCELLED') {
    return 'error'
  }
  return 'warning'
}
