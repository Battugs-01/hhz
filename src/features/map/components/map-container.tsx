import { Skeleton } from '@/components/ui/skeleton'
import { LoanUpdateDialog } from '@/features/loans/list/components/loan-update-dialog'
import type { GpsLocs, Loan } from '@/services'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMap,
} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { parseLocation, type MarkerData } from '../utils/map-helpers'
import { LoanMapMarker } from './loan-map-marker'
import { MapLegend } from './map-legend'
import { UserLocationMarker } from './user-location-marker'
import { WorkerMarker } from './worker-marker'

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
  gpsLocs?: GpsLocs[]
  isLoading?: boolean
  onRefresh?: () => void
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [center, map])
  return null
}

export function MapContainer({ loans, gpsLocs = [], isLoading, onRefresh }: MapContainerProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [updateRecord, setUpdateRecord] = useState<Loan | null>(null)

  const defaultCenter: [number, number] = [47.9186, 106.9177]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Error getting location:', err)
      )
    }
  }, [])

  const markers: MarkerData[] = useMemo(() => {
    const list: MarkerData[] = []
    loans.forEach((loan) => {
      const c = loan.customer
      if (!c) return

      // Helper to push valid locations
      const addMarker = (locStr: string | undefined, type: MarkerData['type'], valid: boolean | undefined) => {
        const position = parseLocation(locStr)
        if (position) {
          list.push({
            id: `${loan.id}-${type}`,
            loan,
            position,
            type,
            isValid: valid !== false,
          })
        }
      }

      addMarker(c.location, 'location', c.locationValid ?? undefined)
      addMarker(c.currentLocation, 'current', c.currentValid ?? undefined)
      addMarker(c.workLocation, 'work', c.workValid ?? undefined)
      addMarker(c.additionalLocation, 'additional', c.additionalValid ?? undefined)
    })
    return list
  }, [loans])

  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation
    if (markers.length > 0) return markers[0].position
    if (gpsLocs.length > 0) return [gpsLocs[0].loc.lat, gpsLocs[0].loc.lng] as [number, number]
    return defaultCenter
  }, [markers, gpsLocs, userLocation])

  if (isLoading) {
    return (
      <div className='h-[600px] w-full'>
        <Skeleton className='h-full w-full' />
      </div>
    )
  }

  return (
    <div className='h-[600px] w-full flex flex-col'>
      <LeafletMapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className='z-0 flex-1'
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <RecenterMap center={mapCenter} />

        {userLocation && <UserLocationMarker position={userLocation} />}

        {/* Worker GPS Tracking */}
        {gpsLocs.map((gps, idx) => (
          <WorkerMarker key={`gps-${idx}`} gps={gps} />
        ))}

        {/* Loan markers clustered */}
        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom={true}
        >
          {markers.map((m) => (
            <LoanMapMarker 
              key={m.id} 
              marker={m} 
              userLocation={userLocation} 
              onRefresh={onRefresh}
              onEdit={setUpdateRecord}
            />
          ))}
        </MarkerClusterGroup>
      </LeafletMapContainer>

      <MapLegend loanCount={markers.length} workerCount={gpsLocs.length} />

      {updateRecord && (
        <LoanUpdateDialog
          open={!!updateRecord}
          onClose={() => setUpdateRecord(null)}
          onSuccess={() => {
            setUpdateRecord(null)
            onRefresh?.()
          }}
          data={updateRecord}
        />
      )}
    </div>
  )
}
