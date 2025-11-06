import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'canTrade',
  'canWithdraw',
  'kycLevel',
  'vipLevel',
] as const

export const USER_INFORMATION_FILTER_FIELDS: FilterField[] = [
  {
    key: 'canTrade',
    label: 'Can Trade',
    type: 'boolean',
    placeholder: 'Select can trade status...',
  },
  {
    key: 'canWithdraw',
    label: 'Can Withdraw',
    type: 'boolean',
    placeholder: 'Select can withdraw status...',
  },
  {
    key: 'kycLevel',
    label: 'KYC Level',
    type: 'text',
    placeholder: 'Enter KYC level...',
  },
  {
    key: 'vipLevel',
    label: 'VIP Level',
    type: 'text',
    placeholder: 'Enter VIP level...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  USER_INFORMATION_LIST: 'user-information',
  USER_INFORMATION_DETAIL: 'user-information-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'user-information-table',
  EXPORT_FILE_NAME: 'user-information.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'email',
  SEARCH_PLACEHOLDER: 'ID or Email or Sub account id',
} as const
