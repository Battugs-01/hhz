import { type StakeContract } from '@/services'
import {
  Calendar,
  Clock,
  DollarSign,
  Hash,
  Percent,
  Wallet,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DetailCard } from '@/components/detail-card'
import type { DetailField } from '@/components/detail-field'

type ContractDetailContentProps = {
  contract: StakeContract
}

export function ContractDetailContent({
  contract,
}: ContractDetailContentProps) {
  const contractId = contract.contractId || contract.stakeContractId || '-'

  const basicFields: DetailField[] = [
    {
      label: 'Contract ID',
      value: contractId,
      icon: <Hash className='h-4 w-4' />,
      mask: true,
      copy: !!contractId && contractId !== '-',
    },
    {
      label: 'Contract Name',
      value: contract.stakeContractName || '-',
      icon: <Hash className='h-4 w-4' />,
      highlight: true,
    },
    {
      label: 'Asset',
      value: contract.asset || '-',
      icon: <Wallet className='h-4 w-4' />,
      badge: true,
    },
    {
      label: 'Duration',
      value: contract.duration ? `${contract.duration} days` : '-',
      icon: <Clock className='h-4 w-4' />,
    },
    {
      label: 'APR',
      value: contract.apr !== undefined ? `${contract.apr}%` : '-',
      icon: <Percent className='h-4 w-4' />,
    },
    {
      label: 'Status',
      value: contract.status || 'N/A',
      icon: <DollarSign className='h-4 w-4' />,
      badge: true,
      badgeVariant: contract.status === 'active' ? 'success' : 'secondary',
    },
  ]

  const amountFields: DetailField[] = [
    {
      label: 'Min Amount',
      value:
        contract.minAmount !== undefined
          ? contract.minAmount.toLocaleString()
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Max Amount',
      value:
        contract.maxAmount !== undefined
          ? contract.maxAmount.toLocaleString()
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
    },
    {
      label: 'Decimal Places',
      value:
        contract.decimalPlaces !== undefined
          ? String(contract.decimalPlaces)
          : '-',
      icon: <Hash className='h-4 w-4' />,
    },
    {
      label: 'Total Staked Amount',
      value:
        contract.totalStakedAmount !== undefined
          ? contract.totalStakedAmount.toLocaleString()
          : '-',
      icon: <DollarSign className='h-4 w-4' />,
      highlight: true,
    },
  ]

  const metadataFields: DetailField[] = [
    {
      label: 'Created At',
      value: contract.createTime ? formatDate(contract.createTime) : '-',
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: contract.updateTime ? formatDate(contract.updateTime) : '-',
      icon: <Calendar className='h-4 w-4' />,
    },
  ]

  return (
    <div className='space-y-4'>
      {/* Basic Information */}
      <DetailCard title='Basic Information' fields={basicFields} />

      {/* Amount Information */}
      <DetailCard title='Amount Information' fields={amountFields} />

      {/* Cancel Policies */}
      {contract.cancelPolicies && contract.cancelPolicies.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-base font-semibold'>Cancel Policies</h3>
          {contract.cancelPolicies.map((policy, index) => (
            <DetailCard
              key={index}
              title={`Policy ${index + 1}`}
              fields={[
                {
                  label: 'From Date',
                  value: formatDate(policy.fromDate),
                  icon: <Calendar className='h-4 w-4' />,
                },
                {
                  label: 'To Date',
                  value: formatDate(policy.toDate),
                  icon: <Calendar className='h-4 w-4' />,
                },
                {
                  label: 'APR',
                  value: `${policy.apr}%`,
                  icon: <Percent className='h-4 w-4' />,
                },
              ]}
            />
          ))}
        </div>
      )}

      {/* Metadata */}
      <DetailCard title='Metadata' fields={metadataFields} />
    </div>
  )
}
