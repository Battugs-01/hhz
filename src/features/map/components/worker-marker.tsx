import type { GpsLocs } from '@/services'
import { Marker, Popup } from 'react-leaflet'
import { getCarIcon } from '../utils/map-helpers'

interface WorkerMarkerProps {
    gps: GpsLocs
}

export function WorkerMarker({ gps }: WorkerMarkerProps) {
  return (
    <Marker 
        position={[gps.loc.lat, gps.loc.lng]} 
        icon={getCarIcon(gps.label)}
    >
        <Popup>
            <div className='text-sm font-bold'>{gps.label}</div>
            <div className='text-xs text-muted-foreground'>Ажилчны байршил</div>
        </Popup>
    </Marker>
  )
}
