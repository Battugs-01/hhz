import { cn } from '@/lib/utils'

type LogoImageProps = {
  className?: string
}

export function LogoImage({ className }: LogoImageProps) {
  return (
    <img
      src='/images/logo.png'
      alt='Logo'
      className={cn('size-full object-contain', className)}
    />
  )
}
