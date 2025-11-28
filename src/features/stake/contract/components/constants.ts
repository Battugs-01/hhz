export const QUERY_KEYS = {
  STAKE_CONTRACT_LIST: 'stake-contract-list',
  STAKE_CONTRACT_DETAIL: 'stake-contract-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'stake-contract-table',
  EXPORT_FILE_NAME: 'stake-contracts.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'stakeContractName',
  SEARCH_PLACEHOLDER: 'Search by contract name...',
} as const
