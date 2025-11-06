import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type Withdrawal } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

export const createColumns = (): ColumnDef<Withdrawal>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
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
      accessorKey: 'totalAmount',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Total Amount' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const totalAmount = row.getValue('totalAmount') as number | undefined
        const currency = row.original.currency
        if (totalAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2 font-medium'>
            {totalAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'receiveAmount',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Receive Amount' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const receiveAmount = row.getValue('receiveAmount') as
          | number
          | undefined
        const currency = row.original.currency
        if (receiveAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2'>
            {receiveAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'feeAmount',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Fee Amount' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const feeAmount = row.getValue('feeAmount') as number | undefined
        const currency = row.original.currency
        if (feeAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2'>
            {feeAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'currency',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Currency' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('currency')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
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
      accessorKey: 'accountNumber',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Account Number' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const accountNumber = row.getValue('accountNumber') as
          | string
          | undefined
        if (!accountNumber) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>
              {maskValue(accountNumber)}
            </span>
            <CopyButton value={accountNumber} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'walletId',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Wallet ID' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const walletId = row.getValue('walletId') as string | undefined
        if (!walletId) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(walletId)}</span>
            <CopyButton value={walletId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'Wallet.accountName',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Account Name' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const accountName = row.original.Wallet?.accountName
        return <div className='ps-2'>{accountName || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<Withdrawal> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<Withdrawal> }) => {
        const transferTime = row.getValue('transferTime') as string | undefined
        return <div>{formatDate(transferTime)}</div>
      },
      enableSorting: false,
    },
  ]
}
