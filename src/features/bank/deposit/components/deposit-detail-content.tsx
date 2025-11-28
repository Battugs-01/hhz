import { useNavigate } from '@tanstack/react-router'
import { type Deposit } from '@/services'
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

type DepositDetailContentProps = {
  deposit: Deposit
}

export function DepositDetailContent({ deposit }: DepositDetailContentProps) {
  const navigate = useNavigate()
  const { closeDrawer } = useDrawer()
  const transactionFields: DetailField[] = [
    {
      label: 'Transaction ID',
      value: deposit.txnId || '-',
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: !!deposit.txnId,
    },
    {
      label: 'Transaction Amount',
      value:
        deposit.txnAmount !== undefined
          ? `${deposit.txnAmount.toLocaleString()} ${deposit.currency}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Transfer Time',
      value: deposit.transferTime ? formatDate(deposit.transferTime) : '-',
      icon: <Clock className='h-4 w-4' />,
    },
  ]

  const depositFields: DetailField[] = [
    {
      label: 'Deposit Amount',
      value: `${deposit.depositAmount.toLocaleString()} ${deposit.currency}`,
      icon: <CreditCard className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Currency',
      value: deposit.currency,
      icon: <DollarSign className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Status',
      value: deposit.status,
      icon: <ArrowRightLeft className='h-4 w-4' />,
      badge: true,
      badgeVariant: getStatusVariant(deposit.status),
    },
  ]

  const walletFields: DetailField[] = [
    {
      label: 'Payment Wallet ID',
      value: deposit.paymentWalletId || '-',
      icon: <Wallet className='h-4 w-4' />,
    },
  ]

  const userFields: DetailField[] = [
    {
      label: 'User ID',
      value: deposit.userId,
      icon: <User className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'User Email',
      value: deposit.email || deposit.User?.email || '-',
      icon: <Mail className='h-4 w-4' />,
    },
  ]

  const metadataFields: DetailField[] = [
    {
      label: 'ID',
      value: deposit.id,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'Created At',
      value: formatDate(deposit.created_at),
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: formatDate(deposit.updated_at),
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
                params: { id: deposit.userId },
              })
            }}
            className='gap-2'
          >
            <ExternalLink className='h-4 w-4' />
            User Detail
          </Button>
        }
      />

      {/* Deposit Information */}
      <DetailCard title='Deposit Information' fields={depositFields} />

      {/* Transaction Details */}
      <DetailCard title='Transaction Details' fields={transactionFields} />

      {/* Wallet Information */}
      {deposit.paymentWalletId && (
        <DetailCard title='Wallet Information' fields={walletFields} />
      )}

      {/* Metadata */}
      <DetailCard title='Metadata' fields={metadataFields} />
    </div>
  )
}
