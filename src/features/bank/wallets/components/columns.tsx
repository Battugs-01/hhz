import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type Wallet } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<Wallet>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
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
      accessorKey: 'walletCode',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Wallet Code' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const walletCode = row.getValue('walletCode') as string | undefined
        return <div className='ps-2'>{walletCode || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'accountName',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Account Name' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const accountName = row.getValue('accountName') as string | undefined
        return <div className='ps-2'>{accountName || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'accountNumber',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Account Number' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
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
      accessorKey: 'iban',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='IBAN' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const iban = row.getValue('iban') as string | undefined
        if (!iban) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(iban)}</span>
            <CopyButton value={iban} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'Bank.nameMn',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Bank' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const bank = row.original.Bank as { nameMn?: string } | null | undefined
        const bankName = bank?.nameMn
        return <div className='ps-2'>{bankName || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const status = row.getValue('status') as string | undefined
        if (!status) return <div>-</div>
        return (
          <Badge variant='outline' className='capitalize'>
            {status}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'verifiedAt',
      header: ({ column }: { column: Column<Wallet> }) => (
        <DataTableColumnHeader column={column} title='Verified At' />
      ),
      cell: ({ row }: { row: Row<Wallet> }) => {
        const verifiedAt = row.getValue('verifiedAt') as string | undefined
        return <div>{formatDate(verifiedAt)}</div>
      },
      enableSorting: false,
    },
  ]
}
