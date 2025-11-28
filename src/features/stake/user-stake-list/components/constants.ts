import { USERS_STAKE_STATUS } from '@/services'
import type { FilterField } from '@/components/filter-panel'

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const

export const FILTER_KEYS = ['limit', 'status'] as const

export const USER_STAKE_LIST_FILTER_FIELDS: FilterField[] = [
  {
    key: 'limit',
    label: 'Items per page',
    type: 'select',
    options: PAGE_SIZE_OPTIONS.map((size) => ({
      label: `${size} items`,
      value: String(size),
    })),
    placeholder: 'Select page size...',
  },
  {
    key: 'status',
    label: 'Stake Status',
    type: 'select',
    options: [
      { label: 'Ongoing', value: USERS_STAKE_STATUS.ONGOING },
      { label: 'Redeemed', value: USERS_STAKE_STATUS.REDEEMED },
      { label: 'Cancelled', value: USERS_STAKE_STATUS.CANCELLED },
      { label: 'Cancel Requested', value: USERS_STAKE_STATUS.CANCEL_REQUESTED },
      {
        label: 'Cancel Requested Manual',
        value: USERS_STAKE_STATUS.CANCEL_REQUESTED_MANUAL,
      },
      { label: 'Redeem Requested', value: USERS_STAKE_STATUS.REDEEM_REQUESTED },
      {
        label: 'Redeem Requested Manual',
        value: USERS_STAKE_STATUS.REDEEM_REQUESTED_MANUAL,
      },
    ],
    placeholder: 'Select stake status...',
  },
]

export const QUERY_KEYS = {
  USER_STAKE_LIST: 'user-stake-list',
} as const

export const TABLE_CONFIG = {
  ID: 'user-stake-list-table',
  EXPORT_FILE_NAME: 'user-stake-list.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'id',
  SEARCH_PLACEHOLDER: 'Search by ID, contract ID...',
} as const
