import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  EXCHANGE_TXN_FILTER_FIELDS,
  FILTER_KEYS,
  TABLE_CONFIG,
} from './constants'

type ExchangeTxnToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function ExchangeTxnToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: ExchangeTxnToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={EXCHANGE_TXN_FILTER_FIELDS}
      search={{
        id: typeof search.id === 'string' ? search.id : undefined,
        status: typeof search.status === 'string' ? search.status : undefined,
        reason: typeof search.reason === 'string' ? search.reason : undefined,
        receiverBankCode:
          typeof search.receiverBankCode === 'string'
            ? search.receiverBankCode
            : undefined,
        senderBankCode:
          typeof search.senderBankCode === 'string'
            ? search.senderBankCode
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
    />
  )
}
