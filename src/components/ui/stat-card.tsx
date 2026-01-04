import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from './card'
import { Skeleton } from './skeleton'

interface StatCardProps {
  /** Lucide icon component */
  icon: LucideIcon
  /** Label/title of the stat */
  label: string
  /** Value to display */
  value: string | number
  /** Background color class for icon container (e.g., 'bg-primary/10', 'bg-orange-500/10') */
  iconBgClass?: string
  /** Icon color class (e.g., 'text-primary', 'text-orange-500') */
  iconClass?: string
  /** Value color class (e.g., 'text-orange-500', 'text-red-500') */
  valueClass?: string
  /** Additional class for the card */
  className?: string
  /** Loading state */
  isLoading?: boolean
  /** Skeleton width class (e.g., 'w-16', 'w-24') */
  skeletonWidth?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconBgClass = 'bg-primary/10',
  iconClass = 'text-primary',
  valueClass,
  className,
  isLoading = false,
  skeletonWidth = 'w-16',
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className='flex items-center gap-3 p-4 sm:gap-4 sm:p-6'>
        <div className={cn('rounded-lg p-2 sm:p-3', iconBgClass)}>
          <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', iconClass)} />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-muted-foreground truncate text-xs font-medium sm:text-sm'>
            {label}
          </p>
          <div className={cn('text-lg font-bold sm:text-2xl', valueClass)}>
            {isLoading ? (
              <Skeleton className={cn('h-7', skeletonWidth)} />
            ) : (
              value
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
