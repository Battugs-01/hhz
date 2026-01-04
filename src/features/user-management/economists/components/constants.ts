import type { FormFieldConfig } from '@/components/ui/config-form-dialog'
import type { FilterField } from '@/components/filter-panel'
import type { EconomistForm } from './schemas'

export const FILTER_KEYS = ['isActive'] as const

export const ECONOMIST_FORM_FIELDS: FormFieldConfig<EconomistForm>[] = [
  {
    name: 'name',
    label: 'Нэр',
    type: 'text',
    placeholder: 'Жишээ нь: Батболд',
    required: true,
  },
  {
    name: 'description',
    label: 'Тайлбар',
    type: 'textarea',
    placeholder: 'Эдийн засагчийн тухай тайлбар...',
    rows: 3,
  },
  {
    name: 'isActive',
    label: 'Идэвхтэй эсэх',
    type: 'checkbox',
    placeholder: 'Идэвхтэй',
  },
]

export const ECONOMIST_FILTER_FIELDS: FilterField[] = [
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
]

export const QUERY_KEYS = {
  ECONOMIST_LIST: 'economist-list',
  ECONOMIST_DETAIL: 'economist-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'economist-table',
  EXPORT_FILE_NAME: 'economists.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'name',
  SEARCH_PLACEHOLDER: 'Нэрээр хайх...',
} as const
