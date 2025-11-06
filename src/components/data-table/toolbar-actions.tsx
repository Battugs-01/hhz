import { type ReactNode } from 'react'
import { Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ToolbarActionsProps = {
  filterPanel?: ReactNode
  onRefresh?: () => void
  onExport?: () => void
  tableId?: string
  exportFileName?: string
  customActions?: ReactNode
}

export function DataTableToolbarActions({
  filterPanel,
  onRefresh,
  onExport,
  tableId,
  exportFileName,
  customActions,
}: ToolbarActionsProps) {
  const handleExport = () => {
    if (onExport) {
      onExport()
      return
    }

    if (!exportFileName || !tableId) return

    try {
      const tableElement = document.getElementById(tableId)
      if (tableElement) {
        console.log('Export', exportFileName, tableElement)
        // TODO: Implement actual export functionality
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
      {(onExport || (exportFileName && tableId)) && (
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
