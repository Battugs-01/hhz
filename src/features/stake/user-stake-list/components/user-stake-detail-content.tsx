import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { type UserStakeList } from '@/services'
import {
  Calendar,
  Coins,
  ExternalLink,
  Hash,
  Info,
  Layers3,
  Timer,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useDrawer } from '@/context/drawer-provider'
import { Button } from '@/components/ui/button'
import { DetailCard, type DetailField } from '@/components/detail-card'
import { formatStakeStatusLabel, getStakeStatusBadgeVariant } from './columns'

type UserStakeDetailContentProps = {
  stake: UserStakeList
}

export function UserStakeDetailContent({ stake }: UserStakeDetailContentProps) {
  const navigate = useNavigate()
  const { closeDrawer } = useDrawer()

  const stakeInfoFields: DetailField[] = [
    {
      label: 'Stake ID',
      value: stake.id,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'Contract ID',
      value: stake.stakeContractId || '-',
      icon: <Layers3 className='h-4 w-4' />,
      copy: !!stake.stakeContractId,
    },
    {
      label: 'Asset',
      value: stake.asset || '-',
      icon: <Coins className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Stake Status',
      value: formatStakeStatusLabel(stake.stakeStatus),
      icon: <TrendingUp className='h-4 w-4' />,
      badge: true,
      badgeVariant: getStakeStatusBadgeVariant(stake.stakeStatus),
    },
    {
      label: 'Status',
      value: stake.status || '-',
      icon: <Info className='h-4 w-4' />,
      badge: true,
      badgeVariant:
        stake.status === 'active'
          ? 'success'
          : stake.status === 'inactive'
            ? 'secondary'
            : 'default',
    },
  ]

  const amountFields: DetailField[] = [
    {
      label: 'Staked Amount',
      value:
        stake.stakedAmount !== undefined && stake.stakedAmount !== null
          ? `${stake.stakedAmount.toLocaleString()} ${stake.asset}`
          : '-',
      icon: <Coins className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Total Amount',
      value:
        stake.totalAmount !== undefined && stake.totalAmount !== null
          ? `${stake.totalAmount.toLocaleString()} ${stake.asset}`
          : '-',
      icon: <Coins className='h-4 w-4' />,
    },
    {
      label: 'Reward Amount',
      value:
        stake.rewardAmount !== undefined && stake.rewardAmount !== null
          ? `${stake.rewardAmount.toLocaleString()} ${stake.asset}`
          : '-',
      icon: <Trophy className='h-4 w-4' />,
    },
    {
      label: 'APR',
      value:
        stake.apr !== undefined && stake.apr !== null ? `${stake.apr}%` : '-',
      icon: <TrendingUp className='h-4 w-4' />,
    },
  ]

  const timelineFields: DetailField[] = [
    {
      label: 'Created At',
      value: stake.createTime ? formatDate(stake.createTime) : '-',
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: stake.updateTime ? formatDate(stake.updateTime) : '-',
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Cancel Time',
      value: stake.cancelTime ? formatDate(stake.cancelTime) : '-',
      icon: <Timer className='h-4 w-4' />,
    },
  ]

  const historyFields = useMemo<DetailField[]>(() => {
    const history = stake.metadata?.history || []
    if (!history.length) {
      return [
        {
          label: 'History',
          value: 'No history available',
          icon: <Info className='h-4 w-4' />,
        },
      ]
    }

    return history.flatMap((entry, index) => {
      const entryIndex = index + 1
      return [
        {
          label: `History #${entryIndex} - Binance Txn ID`,
          value: entry.binanceTxnId || '-',
          icon: <Hash className='h-4 w-4' />,
          mask: true,
          copy: !!entry.binanceTxnId,
        },
        {
          label: `History #${entryIndex} - Txn ID`,
          value: entry.txnId || '-',
          icon: <Hash className='h-4 w-4' />,
          mask: true,
          copy: !!entry.txnId,
        },
        {
          label: `History #${entryIndex} - Timestamp`,
          value: entry.timestamp ? formatDate(entry.timestamp) : '-',
          icon: <Timer className='h-4 w-4' />,
        },
      ]
    })
  }, [stake.metadata?.history])

  return (
    <div className='space-y-4'>
      <DetailCard
        title='User Information'
        fields={[
          {
            label: 'User ID',
            value: stake.uid || '-',
            icon: <User className='h-4 w-4' />,
            mask: true,
            copy: !!stake.uid,
          },
        ]}
        headerAction={
          stake.uid ? (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => {
                closeDrawer()
                navigate({
                  to: '/user-information/$id',
                  params: { id: stake.uid! },
                })
              }}
            >
              <ExternalLink className='h-4 w-4' />
              User Detail
            </Button>
          ) : undefined
        }
      />

      <DetailCard title='Stake Summary' fields={stakeInfoFields} />

      <DetailCard title='Amount Details' fields={amountFields} />

      <DetailCard title='Timeline' fields={timelineFields} />

      <DetailCard title='Metadata History' fields={historyFields} />
    </div>
  )
}
