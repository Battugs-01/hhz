import { useNavigate } from '@tanstack/react-router'
import { type CryptoDeposit } from '@/services'
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

type CryptoDepositDetailContentProps = {
  deposit: CryptoDeposit
}

export function CryptoDepositDetailContent({
  deposit,
}: CryptoDepositDetailContentProps) {
  const navigate = useNavigate()
  const { closeDrawer } = useDrawer()

  const coinSymbol = (deposit as any).coin?.coin || deposit.currency || '-'
  const coinName = (deposit as any).coin?.name
  const network = (deposit as any).network
  const txId = (deposit as any).txId
  const usdtValuation = (deposit as any).usdtValuation
  const insertTime = (deposit as any).insertTime
  const amount = (deposit as any).amount ?? deposit.depositAmount

  const transactionFields: DetailField[] = [
    {
      label: 'Transaction ID',
      value: txId || deposit.txnId || '-',
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: !!(txId || deposit.txnId),
    },
    {
      label: 'Transaction Amount',
      value:
        deposit.txnAmount !== undefined
          ? `${deposit.txnAmount.toLocaleString()} ${coinSymbol}`
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
      value:
        amount !== undefined && amount !== null
          ? `${amount.toLocaleString()} ${coinSymbol}`
          : '-',
      icon: <CreditCard className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Currency',
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
      value: network || '-',
      icon: <Wallet className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'USDT Valuation',
      value:
        usdtValuation !== undefined
          ? `$${usdtValuation.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Status',
      value:
        typeof deposit.status === 'string'
          ? deposit.status
          : deposit.status === 1
            ? 'Completed'
            : deposit.status === 0
              ? 'Pending'
              : String(deposit.status),
      icon: <ArrowRightLeft className='h-4 w-4' />,
      badge: true,
      badgeVariant: getStatusVariant(
        typeof deposit.status === 'string'
          ? deposit.status
          : deposit.status === 1
            ? 'Completed'
            : deposit.status === 0
              ? 'Pending'
              : String(deposit.status)
      ),
    },
  ]

  const addressFields: DetailField[] = [
    {
      label: 'Address',
      value: deposit.address?.address || '-',
      icon: <Wallet className='h-4 w-4' />,
      mask: true,
      copy: !!deposit.address?.address,
    },
    {
      label: 'Source Address',
      value: deposit.sourceAddress || '-',
      icon: <Wallet className='h-4 w-4' />,
      mask: true,
      copy: !!deposit.sourceAddress,
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
      label: 'Payment Wallet ID',
      value: deposit.paymentWalletId || '-',
      icon: <Wallet className='h-4 w-4' />,
    },
    {
      label: 'Insert Time',
      value: insertTime ? formatDate(insertTime) : '-',
      icon: <Clock className='h-4 w-4' />,
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

      {/* Address Information */}
      {(deposit.address?.address || deposit.sourceAddress) && (
        <DetailCard title='Address Information' fields={addressFields} />
      )}

      {/* Metadata */}
      <DetailCard title='Metadata' fields={metadataFields} />
    </div>
  )
}
