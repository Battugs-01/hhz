import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { CopyButton } from '@/components/copy-button'
import { TakeAction } from '@/services/types/takeAction.types'

export const createColumns = (): ColumnDef<TakeAction>[] => {
  return [
    {
      accessorKey: 'actionId',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const actionId = row.getValue('actionId') as string
        return (
          <div
            className='flex items-center gap-1 ps-2'
          >
            <span className='hover:text-primary font-mono text-sm text-nowrap underline'>
              {maskValue(actionId)}
            </span>
            <CopyButton value={actionId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const status = row.getValue('status') as 'active' | 'inactive'
        return (
          <Badge variant={status === 'active' ? 'success' : 'secondary'}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'type',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const type = row.getValue('type') as string
        return (
          <div className='text-sm'>
            {type !== undefined ? type : '-'}
          </div>
        )
      },
      enableSorting: false,
    },

    {
      accessorKey: 'contentType',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='Content Type' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const contentType = row.getValue('contentType') as string
        return (
          <div className='text-sm'>
            {contentType !== undefined ? contentType : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='updated At' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const updatedAt = row.getValue('updatedAt') as string | undefined
        return (
          <div className='text-muted-foreground text-sm'>
            {updatedAt ? formatDate(updatedAt) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<TakeAction> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<TakeAction> }) => {
        const date = row.getValue('createdAt') as string
        return <div className='text-sm'>{formatDate(date)}</div>
      },
      enableSorting: false,
    },
  ]
}
