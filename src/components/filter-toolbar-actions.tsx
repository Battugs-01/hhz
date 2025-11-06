import { useCallback } from 'react'
import { useFilterHandlers } from '@/hooks/use-filter-handlers'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTableToolbarActions } from '@/components/data-table/toolbar-actions'
import type { FilterField, FilterValues } from '@/components/filter-panel'
import { FilterPanel } from '@/components/filter-panel'

type FilterToolbarActionsProps = {
  /** Filter fields configuration */
  fields: FilterField[]
  /** Current search values */
  search: FilterValues & {
    start_day?: string
    end_day?: string
  }
  /** Navigate function from route */
  navigate: NavigateFn
  /** Filter keys to handle (excluding date range) */
  filterKeys: readonly string[]
  /** Date range change handler */
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  /** Refresh handler */
  onRefresh: () => void
  /** Export handler */
  onExport?: () => void
  /** Table ID for export */
  tableId: string
  /** Export file name */
  exportFileName: string
  /** Filter panel title */
  filterTitle?: string
  /** Filter panel description */
  filterDescription?: string
}

/**
 * Generic toolbar actions component with filter panel
 *
 * @example
 * <FilterToolbarActions
 *   fields={FILTER_FIELDS}
 *   search={search}
 *   navigate={navigate}
 *   filterKeys={FILTER_KEYS}
 *   onDateRangeChange={handleDateRangeChange}
 *   onRefresh={refetch}
 *   tableId="my-table"
 *   exportFileName="data.xlsx"
 * />
 */
export function FilterToolbarActions({
  fields,
  search,
  navigate,
  filterKeys,
  onDateRangeChange,
  onRefresh,
  onExport,
  tableId,
  exportFileName,
  filterTitle,
  filterDescription,
}: FilterToolbarActionsProps) {
  const { handleFilterChange, handleClearFilters } = useFilterHandlers({
    navigate,
    filterKeys,
    dateRangeKeys: ['start_day', 'end_day'],
  })

  const handleExportInternal = useCallback(() => {
    if (onExport) {
      onExport()
    } else {
      try {
        const tableElement = document.getElementById(tableId)
        if (tableElement) {
          // TODO: Implement actual export functionality
          // Consider using libraries like xlsx or csv-export
        }
      } catch (error) {
        // Error is handled by global error handler
        // In production, use proper logging service
        if (import.meta.env.DEV) {
          console.error('Export error:', error)
        }
      }
    }
  }, [onExport, tableId, exportFileName])

  // Extract filter values (excluding date range)
  const filterValues: FilterValues = {}
  filterKeys.forEach((key) => {
    if (search[key] !== undefined) {
      filterValues[key] = search[key]
    }
  })

  return (
    <DataTableToolbarActions
      filterPanel={
        <FilterPanel
          fields={fields}
          search={filterValues}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          dateRange={{
            start_day: search.start_day,
            end_day: search.end_day,
          }}
          onDateRangeChange={onDateRangeChange}
          title={filterTitle}
          description={filterDescription}
        />
      }
      onRefresh={onRefresh}
      onExport={handleExportInternal}
      tableId={tableId}
      exportFileName={exportFileName}
    />
  )
}
