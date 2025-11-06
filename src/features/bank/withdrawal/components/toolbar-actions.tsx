import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  FILTER_KEYS,
  TABLE_CONFIG,
  WITHDRAWAL_FILTER_FIELDS,
} from './constants'

type WithdrawalToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

/**
 * Toolbar actions component for Withdrawal page
 * Handles filter panel, refresh, and export functionality
 */
export function WithdrawalToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: WithdrawalToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={WITHDRAWAL_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
        totalAmount:
          typeof search.totalAmount === 'string'
            ? search.totalAmount
            : undefined,
        accountNumber:
          typeof search.accountNumber === 'string'
            ? search.accountNumber
            : undefined,
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
