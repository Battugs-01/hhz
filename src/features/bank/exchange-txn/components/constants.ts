import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'status',
  'id',
  'reason',
  'receiverBankCode',
  'senderBankCode',
] as const

export const EXCHANGE_TXN_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Exchange Txn ID',
    type: 'text',
    placeholder: 'Enter exchange txn ID...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Completed', value: 'completed' },
      { label: 'IBAN', value: 'iban' },
      { label: 'Timeout', value: 'timeout' },
      { label: 'Error', value: 'error' },
    ],
    placeholder: 'Select status...',
  },
  {
    key: 'reason',
    label: 'Reason',
    type: 'select',
    options: [
      { label: 'OTP Verification', value: 'OTP_VERIFICATION' },
      { label: 'Withdrawal', value: 'WITHDRAWAL' },
    ],
    placeholder: 'Select reason...',
  },
  {
    key: 'receiverBankCode',
    label: 'Receiver Bank Code',
    type: 'text',
    placeholder: 'Enter receiver bank code...',
  },
  {
    key: 'senderBankCode',
    label: 'Sender Bank Code',
    type: 'text',
    placeholder: 'Enter sender bank code...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  EXCHANGE_TXN_LIST: 'exchange-txn',
  EXCHANGE_TXN_DETAIL: 'exchange-txn-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'exchange-txn-table',
  EXPORT_FILE_NAME: 'exchange-txn.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const

export function getStatusVariant(
  status: string
): 'success' | 'error' | 'warning' {
  if (status === 'completed') {
    return 'success'
  }
  if (status === 'error' || status === 'timeout') {
    return 'error'
  }
  if (status === 'iban') {
    return 'warning'
  }
  return 'warning'
}
