import { type NavigateOptions } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { type User } from '@/services'
import dayjs from 'dayjs'
import { cn, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

type ColumnCreatorProps = {
  navigate: (options: NavigateOptions) => void
}

export const createColumns = ({
  navigate,
}: ColumnCreatorProps): ColumnDef<User>[] => {
  const handleSearch = (columnKey: string, value: string) => {
    const finalValue = value && value.trim() ? value.trim() : undefined
    navigate({
      search: (prev: any) => {
        const newSearch: any = {
          ...prev,
          page: 1, // Reset to first page on search
        }
        if (finalValue === undefined) {
          // Explicitly delete the key when value is undefined
          delete newSearch[columnKey]
        } else {
          newSearch[columnKey] = finalValue
        }
        return newSearch
      },
      replace: false, // Use replace: false to ensure URL update triggers React Query
    })
  }

  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }) => {
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => {
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sub Account ID' />
      ),
      cell: ({ row }) => {
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
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          column={column}
          title='canTrade'
          searchable={true}
          searchType='select'
          searchOptions={[
            { label: '✓ True', value: 'true' },
            { label: '✗ False', value: 'false' },
          ]}
          onSearch={(value) => handleSearch('canTrade', value)}
        />
      ),
      cell: ({ row }: { row: any }) => (
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
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader
          column={column}
          title='canWithdraw'
          searchable={true}
          searchType='select'
          searchOptions={[
            { label: '✓ True', value: 'true' },
            { label: '✗ False', value: 'false' },
          ]}
          onSearch={(value) => handleSearch('canWithdraw', value)}
        />
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
        <DataTableColumnHeader
          column={column}
          title='kycLevel'
          searchable={true}
          onSearch={(value) => handleSearch('kycLevel', value)}
        />
      ),
      cell: ({ row }) => (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize')}>
            {row.getValue('kycLevel')}
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
    },
    {
      accessorKey: 'vipLevel',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='vipLevel'
          searchable={true}
          onSearch={(value) => handleSearch('vipLevel', value)}
        />
      ),
      cell: ({ row }) => (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize')}>
            {row.getValue('vipLevel')}
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Created at'
          searchable={true}
          onSearch={(value) => handleSearch('created_at', value)}
        />
      ),
      cell: ({ row }) => (
        <div>
          {dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      ),
      enableSorting: false,
    },
    // {
    //   accessorKey: 'updated_at',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Updated at' />
    //   ),
    //   cell: ({ row }) => (
    //     <div>
    //       {dayjs(row.getValue('updated_at')).format('YYYY-MM-DD HH:mm:ss')}
    //     </div>
    //   ),
    //   enableSorting: false,
    // },
  ]
}
