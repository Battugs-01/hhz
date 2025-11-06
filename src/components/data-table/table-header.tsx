import { type ReactNode } from 'react'
import { Download, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TableHeaderProps {
  title?: string
  description?: string
  hideCreate?: boolean
  createButtonLabel?: string
  createButtonIcon?: ReactNode
  hideRefresh?: boolean
  hideExport?: boolean
  fileName?: string
  tableID?: string
  customActions?: ReactNode
  onCreate?: () => void
  onRefresh?: () => void
  onExport?: () => void
  className?: string
}

export function TableHeader({
  title,
  description,
  hideCreate,
  createButtonLabel = 'Create',
  createButtonIcon,
  hideRefresh,
  hideExport,
  fileName,
  tableID,
  customActions,
  onCreate,
  onRefresh,
  onExport,
  className,
}: TableHeaderProps) {
  const handleExport = () => {
    if (onExport) {
      onExport()
      return
    }

    if (!fileName || !tableID) return

    try {
      const tableElement = document.getElementById(tableID)
      if (tableElement) {
        console.log('Export', fileName, tableElement)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const showActionButtons =
    !hideRefresh || !hideExport || !hideCreate || customActions

  return (
    <div className={className}>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        {(title || description) && (
          <div className='flex flex-col gap-1'>
            {title && (
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            )}
            {description && (
              <p className='text-muted-foreground text-sm'>{description}</p>
            )}
          </div>
        )}

        {showActionButtons && (
          <div className='flex flex-wrap items-center gap-2'>
            {customActions}
            {!hideRefresh && onRefresh && (
              <Button
                type='button'
                variant='outline'
                size='default'
                onClick={onRefresh}
              >
                <RotateCcw className='h-4 w-4' />
                Refresh
              </Button>
            )}
            {!hideExport && (fileName || onExport) && (
              <Button
                type='button'
                variant='outline'
                size='default'
                onClick={handleExport}
              >
                <Download className='h-4 w-4' />
                Export
              </Button>
            )}
            {!hideCreate && onCreate && (
              <Button type='button' size='default' onClick={onCreate}>
                {createButtonIcon || <Plus className='h-4 w-4' />}
                {createButtonLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
