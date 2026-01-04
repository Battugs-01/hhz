import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['district'] as const

export const CUSTOMER_FILTER_FIELDS: FilterField[] = [
  {
    key: 'district',
    label: 'Дүүрэг',
    type: 'select',
    placeholder: 'Дүүрэг сонгох...',
    options: [
      { label: 'Баянзүрх', value: 'Bayanzurkh' },
      { label: 'Чингэлтэй', value: 'Chingeltei' },
      { label: 'Сүхбаатар', value: 'Sukhbaatar' },
      { label: 'Хан-Уул', value: 'Khan-Uul' },
      { label: 'Баянгол', value: 'Bayangol' },
      { label: 'Сонгинохайрхан', value: 'Songino Khairkhan' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Огнооны хүрээ',
    type: 'date-range',
    placeholder: 'Огноогоор шүүх',
  },
]

export const QUERY_KEYS = {
  CUSTOMER_LIST: 'customer-list',
  CUSTOMER_DETAIL: 'customer-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'customer-table',
  EXPORT_FILE_NAME: 'customers.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Нэр, харилцагчийн ID, регистрээр хайх...',
} as const
