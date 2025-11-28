import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import type { StakeContract } from '@/services'
import { DataTableColumnHeader } from '@/components/data-table'

type CreateColumnsOptions = {
  onNameClick?: (contract: StakeContract) => void
}

export const createColumns = (
  options?: CreateColumnsOptions
): ColumnDef<StakeContract>[] => {
  const { onNameClick } = options || {}
  return [
    {
      accessorKey: 'stakeContractName',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Contract Name' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const name = row.getValue('stakeContractName') as string
        const contract = row.original

        return (
          <div
            className='max-w-[300px] truncate font-medium'
            title={name}
            onClick={(e) => {
              e.stopPropagation()
              if (onNameClick) {
                onNameClick(contract)
              }
            }}
            style={{ cursor: onNameClick ? 'pointer' : 'default' }}
          >
            <span
              className={
                onNameClick ? 'hover:text-primary underline' : undefined
              }
            >
              {name}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'asset',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Asset' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const asset = row.getValue('asset') as string
        return (
          <div className='max-w-[200px] truncate font-medium' title={asset}>
            {asset}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'duration',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Duration (days)' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const duration = row.getValue('duration') as number
        return <div className='text-sm'>{duration}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'apr',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='APR (%)' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const apr = row.getValue('apr') as number | undefined
        return (
          <div className='text-sm'>{apr !== undefined ? `${apr}%` : '-'}</div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'minAmount',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Min Amount' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const minAmount = row.getValue('minAmount') as number
        return <div className='text-sm'>{minAmount.toLocaleString()}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'maxAmount',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Max Amount' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const maxAmount = row.getValue('maxAmount') as number
        return <div className='text-sm'>{maxAmount.toLocaleString()}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'decimalPlaces',
      header: ({ column }: { column: Column<StakeContract> }) => (
        <DataTableColumnHeader column={column} title='Decimal Places' />
      ),
      cell: ({ row }: { row: Row<StakeContract> }) => {
        const decimalPlaces = row.getValue('decimalPlaces') as
          | number
          | undefined
        return (
          <div className='text-sm'>
            {decimalPlaces !== undefined ? decimalPlaces : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
