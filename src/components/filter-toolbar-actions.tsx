import { useCallback } from 'react'
import { useFilterHandlers } from '@/hooks/use-filter-handlers'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTableToolbarActions } from '@/components/data-table/toolbar-actions'
import type { FilterField, FilterValues } from '@/components/filter-panel'
import { FilterPanel } from '@/components/filter-panel'

type FilterToolbarActionsProps = {
  fields: FilterField[]
  search: FilterValues & {
    start_day?: string
    end_day?: string
  }
  navigate: NavigateFn
  filterKeys: readonly string[]
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
  onExport?: () => void
  tableId: string
  exportFileName: string
  filterTitle?: string
  filterDescription?: string
}

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
