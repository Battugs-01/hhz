import { FilterField } from '@/components/filter-panel'

export const JUDGE_LOAN_NOTE_FILTER_KEYS = [
  'judgeLoanId',
  'customerId',
  'createdBy',
  'phoneNumber',
  'registerNumber',
  'start_day',
  'end_day',
  'query'
] as const

export const JUDGE_LOAN_NOTE_FILTER_FIELDS: FilterField[] = [
  {
    key: 'judgeLoanId',
    label: 'Шүүхийн зээл ID',
    type: 'number',
    placeholder: 'ID...',
  },
  {
    key: 'customerId',
    label: 'Харилцагчийн ID',
    type: 'number',
    placeholder: 'ID...',
  },
  {
    key: 'createdBy',
    label: 'Тэмдэглэсэн (ID)',
    type: 'number',
    placeholder: 'ID...',
  },
  {
    key: 'phoneNumber',
    label: 'Утас',
    type: 'text',
    placeholder: 'Утас...',
  },
  {
    key: 'registerNumber',
    label: 'Регистр',
    type: 'text',
    placeholder: 'Регистр...',
  },
  {
    key: 'dateRange',
    label: 'Огноо',
    type: 'date-range',
  }
]
