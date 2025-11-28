import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { COINS_FILTER_FIELDS, FILTER_KEYS, TABLE_CONFIG } from './constants'

export interface CoinsToolbarActionsProps {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function CoinsToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: CoinsToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={COINS_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        symbol: typeof search.symbol === 'string' ? search.symbol : undefined,
        trading:
          typeof search.trading === 'string' ? search.trading : undefined,
        deposit:
          typeof search.deposit === 'string' ? search.deposit : undefined,
        withdrawals:
          typeof search.withdrawals === 'string'
            ? search.withdrawals
            : undefined,
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
