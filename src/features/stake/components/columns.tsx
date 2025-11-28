import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type Stake } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

export const createColumns = (): ColumnDef<Stake>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
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
      accessorKey: 'userId',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='User ID' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const userId = row.getValue('userId') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm text-nowrap'>
              {maskValue(userId)}
            </span>
            <CopyButton value={userId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'stakeAmount',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Stake Amount' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const amount = row.getValue('stakeAmount') as number
        const currency = row.original.currency
        return (
          <div className='ps-2 font-medium'>
            {amount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'rewardAmount',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Reward Amount' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const rewardAmount = row.getValue('rewardAmount') as number | undefined
        const currency = row.original.currency
        if (rewardAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2'>
            {rewardAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'apy',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='APY' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const apy = row.getValue('apy') as number | undefined
        if (apy === undefined) return <div>-</div>
        return <div className='ps-2'>{apy}%</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'duration',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Duration' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const duration = row.getValue('duration') as number | undefined
        if (duration === undefined) return <div>-</div>
        return <div className='ps-2'>{duration} days</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'currency',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Currency' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('currency')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={getStatusVariant(status)} className='capitalize'>
            {status}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'startDate',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Start Date' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const startDate = row.getValue('startDate') as string | undefined
        return <div>{formatDate(startDate)}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'endDate',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='End Date' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const endDate = row.getValue('endDate') as string | undefined
        return <div>{formatDate(endDate)}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'unlockDate',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Unlock Date' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const unlockDate = row.getValue('unlockDate') as string | undefined
        return <div>{formatDate(unlockDate)}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'txnId',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Transaction ID' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const txnId = row.getValue('txnId') as string | undefined
        if (!txnId) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(txnId)}</span>
            <CopyButton value={txnId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: { column: Column<Stake> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<Stake> }) => {
        const createdAt = row.original.created_at
        return <div>{formatDate(createdAt)}</div>
      },
      enableSorting: false,
    },
  ]
}
