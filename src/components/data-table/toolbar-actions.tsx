import { type ReactNode } from 'react'
import type { Table } from '@tanstack/react-table'
import { Download, RotateCcw } from 'lucide-react'
import { exportTable } from '@/utils/table-export'
import { Button } from '@/components/ui/button'

type ToolbarActionsProps<TData = unknown> = {
  filterPanel?: ReactNode
  onRefresh?: () => void
  onExport?: () => void
  table?: Table<TData>
  tableId?: string
  exportFileName?: string
  customActions?: ReactNode
}

export function DataTableToolbarActions<TData = unknown>({
  filterPanel,
  onRefresh,
  onExport,
  table,
  tableId,
  exportFileName,
  customActions,
}: ToolbarActionsProps<TData>) {
  const handleExport = async () => {
    console.log('Export clicked', {
      table: !!table,
      exportFileName,
      tableId,
      onExport: !!onExport,
    })

    // Use table instance if available (preferred method)
    if (table && exportFileName) {
      const format = exportFileName.endsWith('.xlsx') ? 'excel' : 'csv'
      console.log('Exporting with table instance', {
        format,
        fileName: exportFileName,
        rowCount: table.getRowModel().rows.length,
      })
      try {
        await exportTable<any>(table, exportFileName, format)
        console.log('Export completed successfully')
      } catch (error) {
        console.error('Export error:', error)
      }
      return
    }

    // Fallback to onExport callback if table instance is not available
    if (onExport) {
      onExport()
      return
    }

    // Fallback to tableId if table instance is not available
    if (!exportFileName || !tableId) {
      console.warn('Export failed: missing table instance or exportFileName', {
        table: !!table,
        exportFileName,
        tableId,
      })
      return
    }

    try {
      const tableElement = document.getElementById(tableId)
      if (tableElement) {
        console.log('Export', exportFileName, tableElement)
        // TODO: Implement fallback export using tableElement
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const hasActions =
    filterPanel ||
    onRefresh ||
    onExport ||
    (exportFileName && tableId) ||
    customActions

  if (!hasActions) return null

  return (
    <div className='flex items-center gap-2'>
      {filterPanel}
      {customActions}
      {onRefresh && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={onRefresh}
          className='h-8 gap-2'
        >
          <RotateCcw className='h-4 w-4' />
          Refresh
        </Button>
      )}
      {(onExport || (exportFileName && (table || tableId))) && (
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleExport}
          className='h-8 gap-2'
        >
          <Download className='h-4 w-4' />
          Export
        </Button>
      )}
    </div>
  )
}
