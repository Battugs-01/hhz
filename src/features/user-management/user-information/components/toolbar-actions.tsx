import type { Table } from '@tanstack/react-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  FILTER_KEYS,
  TABLE_CONFIG,
  USER_INFORMATION_FILTER_FIELDS,
} from './constants'

type UserInformationToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
  table?: Table<any>
}

export function UserInformationToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
  table,
}: UserInformationToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={USER_INFORMATION_FILTER_FIELDS}
      search={{
        canTrade:
          typeof search.canTrade === 'string' ? search.canTrade : undefined,
        canWithdraw:
          typeof search.canWithdraw === 'string'
            ? search.canWithdraw
            : undefined,
        kycLevel:
          typeof search.kycLevel === 'string' ? search.kycLevel : undefined,
        vipLevel:
          typeof search.vipLevel === 'string' ? search.vipLevel : undefined,
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
