import { FormFieldConfig } from '@/components/ui/config-form-dialog'
import type { LoanUpdateForm } from './schemas'

export const LOAN_UPDATE_FORM_FIELDS: FormFieldConfig<LoanUpdateForm>[] = [
  {
    name: 'status',
    label: 'Төлөв сонгох',
    type: 'select',
    required: true,
    placeholder: 'Төлөв сонгох',
    // Options will be populated dynamically from API
  },
  // Judge info fields - shown when status === "3"
  {
    name: 'district',
    label: 'Дүүрэг сонгох',
    type: 'select',
    required: true,
    placeholder: 'Дүүрэг сонгох',
    showWhen: {
      field: 'status',
      value: '3',
    },
    // Options will be populated dynamically from API
  },
  {
    name: 'judge',
    label: 'Шүүгч',
    type: 'text',
    required: true,
    placeholder: 'Шүүгч',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'assistant',
    label: 'Шүүгчийн туслах',
    type: 'text',
    required: true,
    placeholder: 'Шүүгчийн туслах',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'assistantPhoneNumber',
    label: 'Туслахын дугаар',
    type: 'text',
    required: true,
    placeholder: 'Утасны дугаар',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'invoiceNumber',
    label: 'Нэхэмжлэлийн дугаар',
    type: 'text',
    required: true,
    placeholder: 'Нэхэмжлэлийн дугаар',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'code',
    label: 'Код',
    type: 'text',
    required: true,
    placeholder: 'Код',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'invoiceDate',
    label: 'Нэхэмжлэлийн огноо',
    type: 'date',
    required: true,
    placeholder: 'Нэхэмжлэлийн огноо',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'ordinance',
    label: 'Захирамжийн утга',
    type: 'text',
    required: true,
    placeholder: 'Захирамжийн утга',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'ordinanceAmount',
    label: 'Захирамжийн дүн',
    type: 'number',
    required: true,
    placeholder: 'Захирамжийн дүн',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'stampFeeAmount',
    label: 'Улсын тэмдэгтийн хураамж',
    type: 'number',
    required: true,
    placeholder: 'Улсын тэмдэгтийн хураамж',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'refundStampFeeAmount',
    label: 'Буцаах тэмдэгтийн хураамж',
    type: 'number',
    required: true,
    placeholder: 'Буцаах тэмдэгтийн хураамж',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'closedStatus',
    label: 'Хаагдсан эсэх',
    type: 'select',
    required: true,
    placeholder: 'Хаагдсан эсэх',
    showWhen: {
      field: 'status',
      value: '3',
    },
    // Options will be populated dynamically from API
  },
  {
    name: 'description',
    label: 'Тайлбар',
    type: 'textarea',
    required: true,
    placeholder: 'Тайлбар',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'responsibleEmployee',
    label: 'Хариуцсан ажилтан',
    type: 'text',
    required: true,
    placeholder: 'Хариуцсан ажилтан',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'invoicedDate',
    label: 'Нэхэмжилсэн огноо',
    type: 'date',
    required: true,
    placeholder: 'Нэхэмжилсэн огноо',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
  {
    name: 'requestedActionPage',
    label: 'Гүйцэтгэх хуудас хүссэн эсэх',
    type: 'text',
    required: true,
    placeholder: 'Гүйцэтгэх хуудас хүссэн эсэх',
    showWhen: {
      field: 'status',
      value: '3',
    },
  },
]

export const FILTER_KEYS = [
  'statusId',
  'loanId',
  'registerNumber',
  'phoneNumber',
  'loanAmount',
  'loanAmount_operator',
  'closePayAmount',
  'closePayAmount_operator',
  'payAmount',
  'payAmount_operator',
  'payInterest',
  'payInterest_operator',
  'overdueDay',
  'overdueDay_operator',
] as const

export const LOAN_FILTER_FIELDS = [
  {
    key: 'loanId',
    label: 'Зээлийн ID',
    type: 'text' as const,
    placeholder: 'Зээлийн ID-аар хайх...',
  },
  {
    key: 'registerNumber',
    label: 'Регистр',
    type: 'text' as const,
    placeholder: 'Регистрийн дугаар...',
  },
  {
    key: 'phoneNumber',
    label: 'Утас',
    type: 'text' as const,
    placeholder: 'Утасны дугаар...',
  },
  {
    key: 'statusId',
    label: 'Төлөв',
    type: 'select' as const,
    placeholder: 'Төлөв сонгох...',
  },
  {
    key: 'loanAmount',
    label: 'Олгосон зээл',
    type: 'number-comparison' as const,
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'closePayAmount',
    label: 'Хаах дүн',
    type: 'number-comparison' as const,
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'payAmount',
    label: 'Төлөх дүн',
    type: 'number-comparison' as const,
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'payInterest',
    label: 'Хүү',
    type: 'number-comparison' as const,
    placeholder: 'Хүү оруулах...',
  },
  {
    key: 'overdueDay',
    label: 'Хэтэрсэн хоног',
    type: 'number-comparison' as const,
    placeholder: 'Хоног оруулах...',
  },
  {
    key: 'dateRange',
    label: 'Огнооны хүрээ',
    type: 'date-range' as const,
    placeholder: 'Огноогоор шүүх',
  },
] as const

export const QUERY_KEYS = {
  LOAN_LIST: 'loan-list',
  LOAN_DETAIL: 'loan-detail',
  LOAN_SUMMARY: 'loan-summary',
} as const

export const TABLE_CONFIG = {
  ID: 'loan-table',
  EXPORT_FILE_NAME: 'loans.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'loanId',
  SEARCH_PLACEHOLDER: 'Зээлийн дугаараар хайх...',
} as const
