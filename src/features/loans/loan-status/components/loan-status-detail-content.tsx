import type { LoanStatus } from '@/services'
import { Calendar, FileText, Hash, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DetailCard } from '@/components/detail-card'
import type { DetailField } from '@/components/detail-field'
import { LOAN_STATUS_LABELS } from './constants'

type LoanStatusDetailContentProps = {
  loanStatus: LoanStatus
}

export function LoanStatusDetailContent({
  loanStatus,
}: LoanStatusDetailContentProps) {
  const statusLabel = LOAN_STATUS_LABELS[loanStatus.status] || loanStatus.status

  const statusFields: DetailField[] = [
    {
      label: 'ID',
      value: loanStatus.id,
      icon: <Hash className='h-4 w-4' />,
      copy: true,
      mask: true,
    },
    {
      label: 'Status',
      value: statusLabel,
      icon: <Tag className='h-4 w-4' />,
      highlight: true,
      badge: true,
    },
    {
      label: 'Description',
      value: loanStatus.description,
      icon: <FileText className='h-4 w-4' />,
    },
  ]

  const timestampFields: DetailField[] = [
    {
      label: 'Created At',
      value: formatDate(loanStatus.createdAt),
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      label: 'Updated At',
      value: formatDate(loanStatus.updatedAt),
      icon: <Calendar className='h-4 w-4' />,
    },
  ]

  return (
    <div className='space-y-4'>
      {/* Status Information */}
      <DetailCard title='Status Information' fields={statusFields} />

      {/* Timestamps */}
      <DetailCard title='Timestamps' fields={timestampFields} />
    </div>
  )
}
