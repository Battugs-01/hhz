import { useNavigate } from '@tanstack/react-router'
import { type CryptoWithdrawal } from '@/services'
import {
  ArrowRightLeft,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Hash,
  Mail,
  User,
  Wallet,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useDrawer } from '@/context/drawer-provider'
import { Button } from '@/components/ui/button'
import { DetailCard } from '@/components/detail-card'
import type { DetailField } from '@/components/detail-field'
import { getStatusVariant } from './constants'

type CryptoWithdrawalDetailContentProps = {
  withdrawal: CryptoWithdrawal
}

export function CryptoWithdrawalDetailContent({
  withdrawal,
}: CryptoWithdrawalDetailContentProps) {
  const navigate = useNavigate()
  const { closeDrawer } = useDrawer()

  const coinSymbol = withdrawal.coin?.coin || '-'
  const coinName = withdrawal.coin?.name
  const statusText =
    withdrawal.status === 1
      ? 'Completed'
      : withdrawal.status === 0
        ? 'Pending'
        : `Status ${withdrawal.status}`

  const withdrawalFields: DetailField[] = [
    {
      label: 'Amount',
      value: `${withdrawal.amount.toLocaleString()} ${coinSymbol}`,
      icon: <CreditCard className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Receive Amount',
      value:
        withdrawal.receiveAmount !== undefined
          ? `${withdrawal.receiveAmount.toLocaleString()} ${coinSymbol}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Transfer Amount',
      value:
        withdrawal.transferAmount !== undefined
          ? `${withdrawal.transferAmount.toLocaleString()} ${coinSymbol}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'BW Fee',
      value:
        withdrawal.BWFee !== undefined
          ? `${withdrawal.BWFee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${coinSymbol}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'SW Fee',
      value:
        withdrawal.SWFee !== undefined
          ? `${withdrawal.SWFee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ${coinSymbol}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Coin',
      value: coinSymbol,
      icon: <DollarSign className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Coin Name',
      value: coinName || '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Network',
      value: withdrawal.network || '-',
      icon: <Wallet className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'USDT Valuation',
      value:
        withdrawal.usdtValuation !== undefined
          ? `$${withdrawal.usdtValuation.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Status',
      value: statusText,
      icon: <ArrowRightLeft className='h-4 w-4' />,
      badge: true,
      badgeVariant: getStatusVariant(statusText),
    },
  ]

  const addressFields: DetailField[] = [
    {
      label: 'Address',
      value: withdrawal.address || '-',
      icon: <Wallet className='h-4 w-4' />,
      mask: true,
      copy: !!withdrawal.address,
    },
    {
      label: 'Address Tag',
      value: withdrawal.addressTag || '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Source Address',
      value: withdrawal.sourceAddress || '-',
      icon: <Wallet className='h-4 w-4' />,
      mask: true,
      copy: !!withdrawal.sourceAddress,
    },
  ]

  const transactionFields: DetailField[] = [
    {
      label: 'Transaction ID',
      value: withdrawal.txnId || '-',
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: !!withdrawal.txnId,
    },
    {
      label: 'Transfer Time',
      value: withdrawal.transferTime
        ? formatDate(withdrawal.transferTime)
        : '-',
      icon: <Clock className='h-4 w-4' />,
    },
    {
      label: 'Transfer Status',
      value: withdrawal.transferStatus || '-',
      icon: <ArrowRightLeft className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Transfer Type',
      value: withdrawal.transferType || '-',
      icon: <ArrowRightLeft className='h-4 w-4' />,
    },
    {
      label: 'Confirm Times',
      value:
        withdrawal.confirmTimes !== undefined &&
        withdrawal.confirmTimes !== null
          ? String(withdrawal.confirmTimes)
          : '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Self Return Status',
      value: withdrawal.selfReturnStatus || '-',
      icon: <ArrowRightLeft className='h-4 w-4' />,
    },
  ]

  const metadataFields: DetailField[] = [
    {
      label: 'Receiver Name',
      value: withdrawal.metadata?.receiverName || '-',
      icon: <User className='h-4 w-4' />,
    },
    {
      label: 'Transfer Purpose',
      value: withdrawal.metadata?.transferPurpose || '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Transfer Source',
      value: withdrawal.metadata?.transferSource || '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Wallet Type',
      value: withdrawal.metadata?.walletType || '-',
      icon: <Wallet className='h-4 w-4' />,
    },
  ]

  const userFields: DetailField[] = [
    {
      label: 'User ID',
      value: withdrawal.userId,
      icon: <User className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'User Email',
      value: withdrawal.User?.email || '-',
      icon: <Mail className='h-4 w-4' />,
    },
  ]

  const systemFields: DetailField[] = [
    {
      label: 'ID',
      value: withdrawal.id,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'Coin ID',
      value: withdrawal.coinId || '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Insert Time',
      value: withdrawal.insertTime ? formatDate(withdrawal.insertTime) : '-',
      icon: <Clock className='h-4 w-4' />,
    },
    {
      label: 'Fetched At',
      value: withdrawal.fetchedAt ? formatDate(withdrawal.fetchedAt) : '-',
      icon: <Clock className='h-4 w-4' />,
    },
    {
      label: 'Created At',
      value: formatDate(withdrawal.created_at),
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: formatDate(withdrawal.updated_at),
      icon: <Calendar className='h-4 w-4' />,
    },
  ]

  return (
    <div className='space-y-4'>
      {/* User Information */}
      <DetailCard
        title='User Information'
        fields={userFields}
        headerAction={
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              closeDrawer()
              navigate({
                to: '/user-information/$id',
                params: { id: withdrawal.userId },
              })
            }}
            className='gap-2'
          >
            <ExternalLink className='h-4 w-4' />
            User Detail
          </Button>
        }
      />

      {/* Withdrawal Information */}
      <DetailCard title='Withdrawal Information' fields={withdrawalFields} />

      {/* Address Information */}
      {(withdrawal.address || withdrawal.sourceAddress) && (
        <DetailCard title='Address Information' fields={addressFields} />
      )}

      {/* Transaction Details */}
      <DetailCard title='Transaction Details' fields={transactionFields} />

      {/* Metadata */}
      {withdrawal.metadata && (
        <DetailCard title='Metadata' fields={metadataFields} />
      )}

      {/* System Information */}
      <DetailCard title='System Information' fields={systemFields} />
    </div>
  )
}
