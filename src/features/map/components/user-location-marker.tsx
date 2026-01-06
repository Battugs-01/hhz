import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

interface UserLocationMarkerProps {
  position: [number, number]
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'user-location-marker',
        html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })}
    >
      <Popup>Таны байршил</Popup>
    </Marker>
  )
}
