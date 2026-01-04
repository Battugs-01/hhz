import type { FilterField } from '@/components/filter-panel'

export const LOAN_STATUS_OPTIONS = [
  { label: 'Хэвийн (Normal)', value: 'normal' },
  { label: 'Хугацаа хэтэрсэн (Overdue)', value: 'overdue' },
  { label: 'Шүүх дээр (On Judge)', value: 'on_judge' },
  { label: 'Шүүхийн шийдвэр (On Judge Finish)', value: 'on_judge_finish' },
  { label: 'Шүүхрүү шилжүүлэх (To Judge)', value: 'to_judge' },
  { label: 'Шүүх хаагдсан (Judge Over)', value: 'judge_over' },
]

export const LOAN_STATUS_LABELS: Record<string, string> = {
  normal: 'Хэвийн',
  overdue: 'Хугацаа хэтэрсэн',
  on_judge: 'Шүүх дээр',
  on_judge_finish: 'Шүүхийн шийдвэр',
  to_judge: 'Шүүхрүү шилжүүлэх',
  judge_over: 'Шүүх хаагдсан',
}

export const FILTER_KEYS = [] as const

export const LOAN_STATUS_FILTER_FIELDS: FilterField[] = [
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  LOAN_STATUS_LIST: 'loan-status-list',
  LOAN_STATUS_DETAIL: 'loan-status-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'loan-status-table',
  EXPORT_FILE_NAME: 'loan-statuses.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Search by status...',
} as const
