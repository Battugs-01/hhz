import { type ColumnDef } from '@tanstack/react-table'
import { type User } from '@/services'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { callTypes } from './constants'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'subAccountId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sub account id' />
    ),
    cell: ({ row }) => <div>{row.getValue('subAccountId')}</div>,
  },
  {
    accessorKey: 'canTrade',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title='canTrade' />
    ),
    cell: ({ row }: { row: any }) => (
      <Badge variant={row.getValue('canTrade') === true ? 'success' : 'error'}>
        {row.getValue('canTrade') === true ? 'True' : 'False'}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'canWithdraw',
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader column={column} title='canWithdraw' />
    ),
    cell: ({ row }: { row: any }) => (
      <Badge
        variant={row.getValue('canWithdraw') === true ? 'success' : 'error'}
      >
        {row.getValue('canWithdraw') === true ? 'True' : 'False'}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'kycLevel',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='kycLevel' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <Badge variant='outline' className={cn('capitalize')}>
          {row.getValue('kycLevel')}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'vipLevel',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='vipLevel' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <Badge variant='outline' className={cn('capitalize')}>
          {row.getValue('vipLevel')}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = callTypes.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created at' />
    ),
    cell: ({ row }) => (
      <div>
        {dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm:ss')}
      </div>
    ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated at' />
    ),
    cell: ({ row }) => (
      <div>
        {dayjs(row.getValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')}
      </div>
    ),
  },
]
