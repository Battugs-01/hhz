import { FormFieldConfig } from '@/components/ui/config-form-dialog'
import type { FilterField } from '@/components/filter-panel'
import { BranchForm } from './schemas'

export const FILTER_KEYS = ['isActive'] as const

export const BRANCH_FORM_FIELDS: FormFieldConfig<BranchForm>[] = [
  {
    name: 'branch',
    label: 'Салбарын нэр',
    type: 'text',
    placeholder: 'Жишээ нь: Төв салбар, 1-р салбар',
    required: true,
  },
  {
    name: 'isActive',
    label: 'Идэвхтэй',
    type: 'checkbox',
    required: false,
  },
]

export const BRANCH_FILTER_FIELDS: FilterField[] = [
  {
    key: 'isActive',
    label: 'Төлөв',
    type: 'select',
    placeholder: 'Төлөв сонгох...',
    options: [
      { label: 'Идэвхтэй', value: 'true' },
      { label: 'Идэвхгүй', value: 'false' },
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
  BRANCH_LIST: 'branch-list',
  BRANCH_DETAIL: 'branch-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'branch-table',
  EXPORT_FILE_NAME: 'branches.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'branch',
  SEARCH_PLACEHOLDER: 'Салбарын нэрээр хайх...',
} as const

export const LOAN_TABLE_CONFIG = {
  ID: 'branch-loans-table',
  EXPORT_FILE_NAME: 'branch-loans.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'loanId',
  SEARCH_PLACEHOLDER: 'Зээлийн ID, регистр, нэрээр хайх...',
} as const

export const LOAN_QUERY_KEYS = {
  BRANCH_LOANS: 'branch-loans',
} as const
