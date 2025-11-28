import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'id',
  'symbol',
  'trading',
  'deposit',
  'withdrawals',
] as const

export const COINS_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Coin ID',
    type: 'text',
    placeholder: 'Enter coin ID...',
  },
  {
    key: 'symbol',
    label: 'Symbol',
    type: 'text',
    placeholder: 'Enter symbol...',
  },
  {
    key: 'trading',
    label: 'Trading',
    type: 'boolean',
    placeholder: 'Select trading status...',
  },
  {
    key: 'deposit',
    label: 'Deposit',
    type: 'boolean',
    placeholder: 'Select deposit status...',
  },
  {
    key: 'withdrawals',
    label: 'Withdrawals',
    type: 'boolean',
    placeholder: 'Select withdrawal status...',
  },
]

export const QUERY_KEYS = {
  COINS_LIST: 'coins',
  COIN_DETAIL: 'coin-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'coins-table',
  EXPORT_FILE_NAME: 'coins.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'id',
  SEARCH_PLACEHOLDER: 'Search by symbol, name, or ID',
} as const
