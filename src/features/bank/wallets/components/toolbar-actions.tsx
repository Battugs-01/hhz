import type { Table } from '@tanstack/react-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { FILTER_KEYS, TABLE_CONFIG, WALLET_FILTER_FIELDS } from './constants'

type WalletToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
  table?: Table<any>
}

/**
 * Toolbar actions component for Wallet page
 * Handles filter panel, refresh, and export functionality
 */
export function WalletToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
  table,
}: WalletToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={WALLET_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
        accountNumber:
          typeof search.accountNumber === 'string'
            ? search.accountNumber
            : undefined,
        accountName:
          typeof search.accountName === 'string'
            ? search.accountName
            : undefined,
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
      table={table}
    />
  )
}
