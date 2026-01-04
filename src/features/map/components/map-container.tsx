import { useEffect, useState } from 'react'
import type { Loan } from '@/services'
import L from 'leaflet'
import {
  MapContainer as LeafletMapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'
import { formatCurrency } from '@/lib/format-utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapContainerProps {
  loans: Loan[]
  isLoading?: boolean
}

// Helper to parse location string "lat lng" to [lat, lng]
const parseLocation = (location: string): [number, number] | null => {
  if (!location || location.trim() === '') return null
  const parts = location.trim().split(/\s+/)
  if (parts.length < 2) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  if (isNaN(lat) || isNaN(lng)) return null
  return [lat, lng]
}

// Get overdue status
const getOverdueStatus = (days: number) => {
  if (days === 0)
    return {
      label: 'Хэвийн',
      variant: 'default' as const,
      color: 'text-green-600',
    }
  if (days <= 30)
    return {
      label: 'Анхаарал',
      variant: 'secondary' as const,
      color: 'text-yellow-600',
    }
  if (days <= 60)
    return {
      label: 'Муу зээл',
      variant: 'outline' as const,
      color: 'text-orange-600',
    }
  return {
    label: 'Ноцтой',
    variant: 'destructive' as const,
    color: 'text-red-600',
  }
}

// Get custom marker icon based on overdue days
const getMarkerIcon = (days: number) => {
  let color = '#10b981' // green
  if (days > 60)
    color = '#ef4444' // red
  else if (days > 30)
    color = '#f97316' // orange
  else if (days > 0) color = '#eab308' // yellow

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

export function MapContainer({ loans, isLoading }: MapContainerProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  )
  const defaultCenter: [number, number] = [47.9186, 106.9177] // Ulaanbaatar

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  if (isLoading) {
    return (
      <div className='h-[600px] w-full'>
        <Skeleton className='h-full w-full' />
      </div>
    )
  }

  // Filter loans with valid locations
  const loansWithLocations = loans
    .map((loan) => ({
      loan,
      position: parseLocation(loan.customer?.location || ''),
    }))
    .filter((item) => item.position !== null) as Array<{
    loan: Loan
    position: [number, number]
  }>

  const mapCenter =
    loansWithLocations.length > 0
      ? loansWithLocations[0].position
      : userLocation || defaultCenter

  return (
    <div className='h-[600px] w-full'>
      <LeafletMapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className='z-0'
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 10px rgba(59,130,246,0.5);
                "></div>
              `,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>
              <div className='text-sm font-medium'>Таны байршил</div>
            </Popup>
          </Marker>
        )}

        {/* Loan markers */}
        {loansWithLocations.map(({ loan, position }) => {
          const overdueStatus = getOverdueStatus(loan.overdueDay)
          return (
            <Marker
              key={loan.id}
              position={position}
              icon={getMarkerIcon(loan.overdueDay)}
            >
              <Popup maxWidth={300}>
                <div className='space-y-3 p-2'>
                  {/* Header */}
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='font-semibold'>Зээл #{loan.id}</p>
                      <p className='text-muted-foreground text-sm'>
                        {loan.customer?.lastName} {loan.customer?.firstName}
                      </p>
                    </div>
                    <Badge variant={overdueStatus.variant} className='text-xs'>
                      {overdueStatus.label}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Зээлийн ID:</span>
                      <span className='font-mono text-xs'>{loan.loanId}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Утас:</span>
                      <span className='font-mono'>
                        {loan.customer?.phoneNumber}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Олгосон:</span>
                      <span className='font-medium'>
                        {formatCurrency(loan.loanAmount)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Төлөх:</span>
                      <span className='font-medium text-orange-600'>
                        {formatCurrency(loan.payAmount)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Хэтэрсэн:</span>
                      <span className={overdueStatus.color}>
                        {loan.overdueDay} хоног
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Төлөв:</span>
                      <span>{loan.status}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => {
                        const [lat, lng] = position
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                          '_blank'
                        )
                      }}
                    >
                      Google Maps
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </LeafletMapContainer>

      {/* Info banner */}
      <div className='text-muted-foreground border-t p-2 text-center text-sm'>
        {loansWithLocations.length} зээл харагдаж байна • Тэмдэглэгээг дарж
        дэлгэрэнгүй харна уу
      </div>
    </div>
  )
}
