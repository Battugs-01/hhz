import type { FormFieldConfig } from '@/components/ui/config-form-dialog'
import type { JudgeCloseStatusForm } from './schemas'

export const QUERY_KEYS = {
  JUDGE_CLOSE_STATUS_LIST: 'judge-close-status-list',
}

export const TABLE_CONFIG = {
  ID: 'judge-close-status-table',
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Төлөв хайх...',
}

export const JUDGE_CLOSE_STATUS_FORM_FIELDS: FormFieldConfig<JudgeCloseStatusForm>[] =
  [
    {
      name: 'status',
      label: 'Төлөв',
      type: 'text',
      required: true,
      placeholder: 'Төлөв оруулах',
    },
    {
      name: 'description',
      label: 'Тайлбар',
      type: 'textarea',
      required: true,
      placeholder: 'Тайлбар оруулах',
    },
    {
      name: 'isActive',
      label: 'Идэвхтэй эсэх',
      type: 'checkbox',
      required: false,
    },
  ]
