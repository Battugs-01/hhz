import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'status',
  'accountNumber',
  'accountName',
  'id',
] as const

export const WALLET_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Bank Account ID',
    type: 'text',
    placeholder: 'Enter bank account ID...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Verified', value: 'verified' },
      { label: 'Pending Verification', value: 'pending_verification' },
    ],
    placeholder: 'Select status...',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    type: 'text',
    placeholder: 'Enter account number...',
  },
  {
    key: 'accountName',
    label: 'Account Name',
    type: 'text',
    placeholder: 'Enter account name...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  WALLET_LIST: 'wallet',
  WALLET_DETAIL: 'wallet-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'wallet-table',
  EXPORT_FILE_NAME: 'bank-accounts.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const
