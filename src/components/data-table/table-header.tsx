export interface TableHeaderProps {
  title?: string
  description?: string
  className?: string
}

export function TableHeader({
  title,
  description,
  className,
}: TableHeaderProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className='flex flex-col gap-1'>
          {title && (
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
          )}
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
