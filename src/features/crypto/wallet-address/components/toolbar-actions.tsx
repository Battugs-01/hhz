import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  FILTER_KEYS,
  TABLE_CONFIG,
  WALLET_ADDRESS_FILTER_FIELDS,
} from './constants'

type WalletAddressToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

/**
 * Toolbar actions component for Wallet Address page
 * Handles filter panel, refresh, and export functionality
 */
export function WalletAddressToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: WalletAddressToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={WALLET_ADDRESS_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        coin: typeof search.coin === 'string' ? search.coin : undefined,
        network:
          typeof search.network === 'string' ? search.network : undefined,
        address:
          typeof search.address === 'string' ? search.address : undefined,
        start_day:
          typeof search.start_day === 'string' ? search.start_day : undefined,
        end_day:
          typeof search.end_day === 'string' ? search.end_day : undefined,
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={TABLE_CONFIG.ID}
      exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
    />
  )
}
