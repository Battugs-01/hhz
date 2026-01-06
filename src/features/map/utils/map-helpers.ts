import type { Loan } from '@/services'
import L from 'leaflet'

export type LocationType = 'location' | 'work' | 'current' | 'additional'

export interface MarkerData {
  id: string
  loan: Loan
  position: [number, number]
  type: LocationType
  isValid: boolean
}

// Helper to parse location string "lat lng" to [lat, lng]
export const parseLocation = (location?: string): [number, number] | null => {
  if (!location || location.trim() === '') return null
  const parts = location.trim().split(/\s+/)
  if (parts.length < 2) return null
  const lat = parseFloat(parts[0])
  const lng = parseFloat(parts[1])
  if (isNaN(lat) || isNaN(lng)) return null
  return [lat, lng]
}

export const getOverdueStatus = (days: number) => {
  if (days === 0) return { label: 'Хэвийн', variant: 'default' as const, color: '#10b981' }
  if (days <= 30) return { label: 'Анхаарал', variant: 'secondary' as const, color: '#eab308' }
  if (days <= 60) return { label: 'Муу зээл', variant: 'outline' as const, color: '#f97316' }
  return { label: 'Ноцтой', variant: 'destructive' as const, color: '#ef4444' }
}

export const getAddressTypeLabel = (type: LocationType) => {
  switch (type) {
    case 'work': return 'Ажлын хаяг'
    case 'additional': return 'Нэмэлт хаяг'
    case 'current': return 'Одоо байгаа байршил'
    default: return 'Гэрийн хаяг'
  }
}

export const getMarkerIcon = (loan: Loan, type: LocationType, isValid: boolean) => {
  const status = getOverdueStatus(loan.overdueDay)
  const color = isValid ? status.color : '#94a3b8' // Gray if invalid
  
  let iconHtml = ''
  switch(type) {
    case 'work': 
      // Briefcase icon
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'; 
      break;
    case 'additional': 
      // Plus in circle icon
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'; 
      break;
    case 'current': 
      // Navigation/Locate icon
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>'; 
      break;
    default: 
      // Home icon (default/location)
      iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="
          background-color: black; 
          color: white; 
          font-weight: bold; 
          font-size: 8px; 
          padding: 1px 4px; 
          margin-bottom: 2px; 
          white-space: nowrap;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">
          ${loan.customer?.firstName} ${loan.registerNumber}
        </div>
        <div style="
          background-color: ${color};
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          ${iconHtml}
        </div>
      </div>
    `,
    iconSize: [60, 40],
    iconAnchor: [30, 40],
    popupAnchor: [0, -40],
  })
}

export const getCarIcon = (label: string) => {
  return L.divIcon({
    className: 'car-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="
          background-color: #3b82f6; 
          color: white; 
          font-weight: bold; 
          font-size: 8px; 
          padding: 1px 4px; 
          margin-bottom: 2px; 
          white-space: nowrap;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">
          ${label}
        </div>
        <div style="
          background-color: #f59e0b;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h1"/><circle cx="18.5" cy="17" r="2.5"/><circle cx="7.5" cy="17" r="2.5"/><path d="M13 17H9"/><path d="M7 10l3-6"/><path d="M5 10l3-6"/></svg>
        </div>
      </div>
    `,
    iconSize: [80, 50],
    iconAnchor: [40, 50],
    popupAnchor: [0, -50],
  })
}
