import { FilterField } from '@/components/filter-panel'

export const LOAN_NOTE_FILTER_KEYS = [
  'loanId',
  'customerId',
  'createdBy',
  'phoneNumber',
  'registerNumber',
  'isNear',
  'start_day',
  'end_day',
  'query'
] as const

export const LOAN_NOTE_FILTER_FIELDS: FilterField[] = [
  {
    key: 'loanId',
    label: 'Зээлийн ID',
    type: 'number',
    placeholder: 'Зээлийн ID...',
  },
  {
    key: 'customerId',
    label: 'Харилцагчийн ID',
    type: 'number',
    placeholder: 'Харилцагчийн ID...',
  },
  {
    key: 'createdBy',
    label: 'Тэмдэглэсэн (ID)',
    type: 'number',
    placeholder: 'Админы ID...',
  },
  {
    key: 'phoneNumber',
    label: 'Утас',
    type: 'text',
    placeholder: 'Утасны дугаар...',
  },
  {
    key: 'registerNumber',
    label: 'Регистр',
    type: 'text',
    placeholder: 'Регистрийн дугаар...',
  },
  {
    key: 'isNear',
    label: 'Ойрхон',
    type: 'boolean',
    placeholder: 'Сонгох...',
  },
  {
    key: 'dateRange',
    label: 'Огноо',
    type: 'date-range',
  }
]
