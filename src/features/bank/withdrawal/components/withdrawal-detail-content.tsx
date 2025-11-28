import { useNavigate } from '@tanstack/react-router'
import { type Withdrawal } from '@/services'
import {
  ArrowRightLeft,
  Building2,
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

type WithdrawalDetailContentProps = {
  withdrawal: Withdrawal
}

export function WithdrawalDetailContent({
  withdrawal,
}: WithdrawalDetailContentProps) {
  const navigate = useNavigate()
  const { closeDrawer } = useDrawer()

  const withdrawalFields: DetailField[] = [
    {
      label: 'Total Amount',
      value:
        withdrawal.totalAmount !== undefined
          ? `${withdrawal.totalAmount.toLocaleString()} ${withdrawal.currency}`
          : '-',
      icon: <CreditCard className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Receive Amount',
      value:
        withdrawal.receiveAmount !== undefined
          ? `${withdrawal.receiveAmount.toLocaleString()} ${withdrawal.currency}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Fee Amount',
      value:
        withdrawal.feeAmount !== undefined
          ? `${withdrawal.feeAmount.toLocaleString()} ${withdrawal.currency}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Currency',
      value: withdrawal.currency,
      icon: <DollarSign className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Status',
      value: withdrawal.status,
      icon: <ArrowRightLeft className='h-4 w-4' />,
      badge: true,
      badgeVariant: getStatusVariant(withdrawal.status),
    },
  ]

  const walletFields: DetailField[] = [
    {
      label: 'Wallet ID',
      value: withdrawal.walletId || '-',
      icon: <Wallet className='h-4 w-4' />,
      mask: true,
      copy: !!withdrawal.walletId,
    },
    {
      label: 'Account Number',
      value: withdrawal.accountNumber || '-',
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: !!withdrawal.accountNumber,
    },
    {
      label: 'Account Name',
      value: withdrawal.Wallet?.accountName || '-',
      icon: <Building2 className='h-4 w-4' />,
    },
    {
      label: 'Bank ID',
      value: withdrawal.bankId || '-',
      icon: <Building2 className='h-4 w-4' />,
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

  const metadataFields: DetailField[] = [
    {
      label: 'ID',
      value: withdrawal.id,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: true,
    },
    {
      label: 'Transfer Time',
      value: withdrawal.transferTime
        ? formatDate(withdrawal.transferTime)
        : '-',
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

      {/* Wallet Information */}
      <DetailCard title='Wallet Information' fields={walletFields} />

      {/* Metadata */}
      <DetailCard title='Metadata' fields={metadataFields} />
    </div>
  )
}
