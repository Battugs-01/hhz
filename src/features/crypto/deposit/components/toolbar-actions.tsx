import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  CRYPTO_DEPOSIT_FILTER_FIELDS,
  FILTER_KEYS,
  TABLE_CONFIG,
} from './constants'

type CryptoDepositToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

/**
 * Toolbar actions component for Crypto Deposit page
 * Handles filter panel, refresh, and export functionality
 */
export function CryptoDepositToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: CryptoDepositToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={CRYPTO_DEPOSIT_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
        currency:
          typeof search.currency === 'string' ? search.currency : undefined,
        txnId: typeof search.txnId === 'string' ? search.txnId : undefined,
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
