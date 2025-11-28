import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = [
  'status',
  'coin',
  'txId',
  'id',
  'network',
  'amount',
  'amountCondition',
  'usdtValuation',
  'usdtValuationCondition',
  'address',
] as const

export const CRYPTO_DEPOSIT_FILTER_FIELDS: FilterField[] = [
  {
    key: 'id',
    label: 'Deposit ID',
    type: 'text',
    placeholder: 'Enter deposit ID...',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Completed', value: '1' },
      { label: 'Pending', value: '0' },
    ],
    placeholder: 'Select status...',
  },
  {
    key: 'amount',
    label: 'Amount',
    type: 'number',
    placeholder: 'Enter amount...',
  },
  {
    key: 'amountCondition',
    label: 'Amount Condition',
    type: 'select',
    options: [
      { label: 'Equal', value: 'EQUAL' },
      { label: 'Greater Than', value: 'GREATER_THAN' },
      { label: 'Less Than', value: 'LESS_THAN' },
    ],
    placeholder: 'Select condition...',
    showWhen: {
      field: 'amount',
      hasValue: true,
    },
  },
  {
    key: 'usdtValuation',
    label: 'USDT Valuation',
    type: 'number',
    placeholder: 'Enter USDT valuation...',
  },
  {
    key: 'usdtValuationCondition',
    label: 'USDT Valuation Condition',
    type: 'select',
    options: [
      { label: 'Equal', value: 'EQUAL' },
      { label: 'Greater Than', value: 'GREATER_THAN' },
      { label: 'Less Than', value: 'LESS_THAN' },
    ],
    placeholder: 'Select condition...',
    showWhen: {
      field: 'usdtValuation',
      hasValue: true,
    },
  },
  {
    key: 'coin',
    label: 'Coin',
    type: 'text',
    placeholder: 'Enter coin symbol...',
  },
  {
    key: 'network',
    label: 'Network',
    type: 'text',
    placeholder: 'Enter network...',
  },
  {
    key: 'txId',
    label: 'Transaction ID',
    type: 'text',
    placeholder: 'Enter transaction ID...',
  },
  {
    key: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Enter address...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  CRYPTO_DEPOSIT_LIST: 'crypto-deposit',
  CRYPTO_DEPOSIT_DETAIL: 'crypto-deposit-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'crypto-deposit-table',
  EXPORT_FILE_NAME: 'crypto-deposits.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Search by User ID, Sub Account ID, or Email',
} as const

/**
 * Maps crypto deposit status to badge variant
 * @param status - Crypto deposit status string
 * @returns Badge variant ('success', 'error', or 'warning')
 */
export function getStatusVariant(
  status: string
): 'success' | 'error' | 'warning' {
  if (status === 'Completed' || status === '1') {
    return 'success'
  }
  if (status === 'Failed' || status === 'CANCELLED') {
    return 'error'
  }
  return 'warning'
}
