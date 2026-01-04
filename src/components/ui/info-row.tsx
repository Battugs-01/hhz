import { cn } from '@/lib/utils'

interface InfoRowProps {
  icon?: React.ElementType
  label: string
  value: React.ReactNode
  className?: string
}

export function InfoRow({ icon: Icon, label, value, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-start gap-3 py-2', className)}>
      {Icon && (
        <Icon className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
      )}
      <div className='min-w-0 flex-1'>
        <p className='text-muted-foreground text-xs'>{label}</p>
        <div className='text-sm font-medium'>{value || '-'}</div>
      </div>
    </div>
  )
}
