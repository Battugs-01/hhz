import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import type { UserStakeList } from '@/services'
import { USERS_STAKE_STATUS } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export function getStakeStatusBadgeVariant(
  status: USERS_STAKE_STATUS | string | undefined
) {
  switch (status) {
    case USERS_STAKE_STATUS.ONGOING:
    case USERS_STAKE_STATUS.REDEEMED:
      return 'success'
    case USERS_STAKE_STATUS.REDEEMABLE:
      return 'default'
    case USERS_STAKE_STATUS.REDEEMING:
    case USERS_STAKE_STATUS.REDEEM_REQUESTED:
    case USERS_STAKE_STATUS.REDEEM_REQUESTED_MANUAL:
    case USERS_STAKE_STATUS.CANCEL_REQUESTED:
    case USERS_STAKE_STATUS.CANCEL_REQUESTED_MANUAL:
    case USERS_STAKE_STATUS.CANCELLING:
      return 'warning'
    case USERS_STAKE_STATUS.CANCELLED:
      return 'destructive'
    case USERS_STAKE_STATUS.PENDING:
    default:
      return 'secondary'
  }
}

export function formatStakeStatusLabel(
  status: USERS_STAKE_STATUS | string | undefined
) {
  if (!status) return 'N/A'
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

type CreateColumnsOptions = {
  onRowClick?: (stake: UserStakeList) => void
}

export const createColumns = (
  options: CreateColumnsOptions = {}
): ColumnDef<UserStakeList>[] => {
  const { onRowClick } = options

  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const id = row.getValue('id') as string
        const maskedId = id ? maskValue(id) : '-'

        if (!onRowClick) {
          return (
            <div
              className='flex max-w-[200px] items-center gap-2 font-mono text-sm'
              title={id}
            >
              <span className='truncate'>{maskedId}</span>
              {id && <CopyButton value={id} />}
            </div>
          )
        }

        return (
          <div
            className='flex max-w-[200px] items-center gap-2 font-mono text-sm'
            title={id}
          >
            <button
              type='button'
              onClick={() => onRowClick(row.original)}
              className={`${buttonVariants({
                variant: 'link',
                size: 'sm',
              })} h-auto p-0 font-mono text-xs underline-offset-2`}
            >
              {maskedId}
            </button>
            {id && <CopyButton value={id} />}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'stakeContractId',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Contract ID' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const contractId = row.getValue('stakeContractId') as string | undefined
        return (
          <div
            className='max-w-[200px] truncate font-medium'
            title={contractId}
          >
            {contractId || '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'asset',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Asset' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const asset = row.getValue('asset') as string
        const assetImage = row.original.assetImage
        return (
          <div className='flex items-center gap-2'>
            {assetImage && (
              <img
                src={assetImage}
                alt={asset}
                className='h-6 w-6 rounded object-cover'
              />
            )}
            <Badge variant='outline' className='capitalize'>
              {asset}
            </Badge>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'stakedAmount',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Staked Amount' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const amount = row.getValue('stakedAmount') as number | undefined
        const asset = row.original.asset
        return (
          <div className='text-center font-medium'>
            {amount !== undefined ? `${amount.toLocaleString()} ${asset}` : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Total Amount' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const amount = row.getValue('totalAmount') as number | undefined
        const asset = row.original.asset
        return (
          <div className='font-medium'>
            {amount !== undefined ? `${amount.toLocaleString()} ${asset}` : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'rewardAmount',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Reward Amount' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const amount = row.getValue('rewardAmount') as number | undefined
        const asset = row.original.asset
        return (
          <div className='font-medium'>
            {amount !== undefined ? `${amount.toLocaleString()} ${asset}` : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'apr',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='APR (%)' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const apr = row.getValue('apr') as number | undefined
        return (
          <div className='text-sm'>{apr !== undefined ? `${apr}%` : '-'}</div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'stakeStatus',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Stake Status' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const stakeStatus = row.getValue('stakeStatus') as
          | USERS_STAKE_STATUS
          | string
          | undefined

        return (
          <Badge
            variant={getStakeStatusBadgeVariant(stakeStatus)}
            className='capitalize'
          >
            {formatStakeStatusLabel(stakeStatus)}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const status = row.getValue('status') as string | undefined
        return (
          <Badge
            variant={status === 'active' ? 'success' : 'secondary'}
            className='capitalize'
          >
            {status || 'N/A'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'uid',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='User ID' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const uid = row.getValue('uid') as string | undefined
        return (
          <div
            className='flex max-w-[200px] items-center gap-2 font-mono text-sm'
            title={uid}
          >
            <span className='truncate'>{uid ? maskValue(uid) : '-'}</span>
            {uid && <CopyButton value={uid} />}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createTime',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const createTime = row.getValue('createTime') as number | undefined
        return (
          <div className='text-sm'>
            {createTime ? formatDate(createTime) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'updateTime',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Updated At' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const updateTime = row.getValue('updateTime') as number | undefined
        return (
          <div className='text-sm'>
            {updateTime ? formatDate(updateTime) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'cancelTime',
      header: ({ column }: { column: Column<UserStakeList> }) => (
        <DataTableColumnHeader column={column} title='Cancel Time' />
      ),
      cell: ({ row }: { row: Row<UserStakeList> }) => {
        const cancelTime = row.getValue('cancelTime') as number | undefined
        return (
          <div className='text-sm'>
            {cancelTime ? formatDate(cancelTime) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
