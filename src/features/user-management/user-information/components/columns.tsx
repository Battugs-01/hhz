import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type User } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<User> }) => {
        const id = row.getValue('id') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm text-nowrap'>
              {maskValue(id)}
            </span>
            <CopyButton value={id} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }: { row: Row<User> }) => {
        const email = row.getValue('email') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='text-nowrap'>{email}</span>
            <CopyButton value={email} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'subAccountId',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='Sub Account ID' />
      ),
      cell: ({ row }: { row: Row<User> }) => {
        const subAccountId = row.getValue('subAccountId') as string
        return (
          <div className='flex items-center gap-1'>
            <span className='font-mono text-sm'>{maskValue(subAccountId)}</span>
            <CopyButton value={subAccountId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'canTrade',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='Can Trade' />
      ),
      cell: ({ row }: { row: Row<User> }) => (
        <Badge
          variant={row.getValue('canTrade') === true ? 'success' : 'error'}
        >
          {row.getValue('canTrade') === true ? 'True' : 'False'}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'canWithdraw',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='Can Withdraw' />
      ),
      cell: ({ row }: { row: Row<User> }) => (
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
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='KYC Level' />
      ),
      cell: ({ row }: { row: Row<User> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('kycLevel')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'vipLevel',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='VIP Level' />
      ),
      cell: ({ row }: { row: Row<User> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('vipLevel')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: { column: Column<User> }) => (
        <DataTableColumnHeader column={column} title='Created at' />
      ),
      cell: ({ row }: { row: Row<User> }) => {
        const date = row.getValue('created_at') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: false,
    },
  ]
}
