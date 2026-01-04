import { ExternalLink, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LocationButtonProps {
  location?: string
  label: string
}

export function LocationButton({ location, label }: LocationButtonProps) {
  if (!location) return <span className='text-muted-foreground text-sm'>-</span>

  const openInMaps = () => {
    const [lat, lng] = location.split(' ')
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='h-8 gap-2'
      onClick={openInMaps}
    >
      <MapPin className='h-3 w-3' />
      <span className='max-w-[150px] truncate text-xs'>{label}</span>
      <ExternalLink className='h-3 w-3' />
    </Button>
  )
}
