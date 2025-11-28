import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['category', 'status'] as const

export const NEWS_FILTER_FIELDS: FilterField[] = [
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'News', value: 'news' },
      { label: 'Announcement', value: 'announcement' },
    ],
    placeholder: 'Select category...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    placeholder: 'Select status...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  NEWS_LIST: 'news-list',
  NEWS_DETAIL: 'news-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'news-table',
  EXPORT_FILE_NAME: 'news.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'nameMon',
  SEARCH_PLACEHOLDER: 'Search by name...',
} as const
