import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['id', 'coin', 'network', 'address'] as const

export const WALLET_ADDRESS_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Wallet Address ID',
    type: 'text',
    placeholder: 'Enter wallet address ID...',
  },
  {
    key: 'coin',
    label: 'Coin',
    type: 'text',
    placeholder: 'Enter coin symbol...',
  },
  {
    key: 'network',
    label: 'Network',
    type: 'text',
    placeholder: 'Enter network...',
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Enter address...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  WALLET_ADDRESS_LIST: 'wallet-address',
  WALLET_ADDRESS_DETAIL: 'wallet-address-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'wallet-address-table',
  EXPORT_FILE_NAME: 'wallet-addresses.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const
