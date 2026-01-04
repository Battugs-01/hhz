import { formatCurrency } from '@/lib/format-utils'
import { cn } from '@/lib/utils'

interface MoneyDisplayProps {
  label: string
  amount: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function MoneyDisplay({
  label,
  amount,
  variant = 'default',
}: MoneyDisplayProps) {
  const colorClass = {
    default: 'text-foreground',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600',
  }[variant]

  return (
    <div className='flex items-center justify-between border-b py-1.5 last:border-0'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span className={cn('text-sm font-semibold', colorClass)}>
        {formatCurrency(amount)}
      </span>
    </div>
  )
}
