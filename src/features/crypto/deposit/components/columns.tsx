import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type CryptoDeposit } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

export const createColumns = (): ColumnDef<CryptoDeposit>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
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
      accessorKey: 'depositAmount',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Deposit Amount' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const amount = row.getValue('depositAmount') as number
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
      accessorKey: 'currency',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Currency' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('currency')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
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
      accessorKey: 'txnId',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Transaction ID' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
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
      accessorKey: 'txnAmount',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Transaction Amount' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const txnAmount = row.getValue('txnAmount') as number | undefined
        const currency = row.original.currency
        if (txnAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2'>
            {txnAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'paymentWalletId',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Payment Wallet ID' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const paymentWalletId = row.getValue('paymentWalletId') as
          | string
          | undefined
        return <div className='ps-2'>{paymentWalletId || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const transferTime = row.getValue('transferTime') as string | undefined
        return <div>{formatDate(transferTime)}</div>
      },
      enableSorting: false,
    },
  ]
}
