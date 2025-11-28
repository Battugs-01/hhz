import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { DEPOSIT_FILTER_FIELDS, FILTER_KEYS, TABLE_CONFIG } from './constants'

type DepositToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function DepositToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: DepositToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={DEPOSIT_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
        amount:
          typeof search.amount === 'number'
            ? String(search.amount)
            : typeof search.amount === 'string' && search.amount !== ''
              ? search.amount
              : undefined,
        condition:
          typeof search.condition === 'string' ? search.condition : undefined,
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
