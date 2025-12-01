import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['category', 'status'] as const

export const TAKE_ACTION_FILTER_FIELDS: FilterField[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    placeholder: 'Select status...',
  }
]

export const QUERY_KEYS = {
  TAKE_ACTION_LIST: 'take-action-list',
  TAKE_ACTION_DETAIL: 'take-action-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'take-action-table',
  EXPORT_FILE_NAME: 'take-action.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'actionId',
  SEARCH_PLACEHOLDER: 'Search by name...',
} as const
