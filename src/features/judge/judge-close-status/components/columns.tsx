import { formatDate } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { JudgeCloseStatus } from '@/services'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table/column-header'

export const createJudgeCloseStatusColumns =
  (): ColumnDef<JudgeCloseStatus>[] => [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }) => <div className='w-[50px]'>{row.getValue('id')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөв' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>
              {row.getValue('status')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тайлбар' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='text-muted-foreground max-w-[500px] truncate'>
              {row.getValue('description')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Идэвхтэй' />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүсгэсэн огноо' />
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date
        return (
          <div className='text-muted-foreground'>
            {formatDate(date, 'yyyy-MM-dd HH:mm')}
          </div>
        )
      },
    },
  ]
