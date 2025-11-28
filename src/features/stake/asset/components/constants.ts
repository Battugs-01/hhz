export const QUERY_KEYS = {
  STAKE_ASSET_LIST: 'stake-asset-list',
  STAKE_ASSET_DETAIL: 'stake-asset-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'stake-asset-table',
  EXPORT_FILE_NAME: 'stake-assets.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'asset',
  SEARCH_PLACEHOLDER: 'Search by asset...',
} as const
