import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/format-utils'
import type { Loan, UpdateCustomerRequest } from '@/services'
import { customerService, loanService } from '@/services'
import L from 'leaflet'
import { CheckCircle, Edit, ExternalLink, Save, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { toast } from 'sonner'
import {
  getAddressTypeLabel,
  getMarkerIcon,
  getOverdueStatus,
  type MarkerData
} from '../utils/map-helpers'

interface LoanMapMarkerProps {
  marker: MarkerData
  userLocation: [number, number] | null
  onRefresh?: () => void
  onEdit: (loan: Loan) => void
}

export function LoanMapMarker({ marker, userLocation, onRefresh, onEdit }: LoanMapMarkerProps) {
  const [note, setNote] = useState('')
  const [isSavingNote, setIsSavingNote] = useState(false)

  const m = marker
  const l = m.loan
  const status = getOverdueStatus(l.overdueDay)

  const handleSaveNote = async () => {
    if (!note.trim()) return
    setIsSavingNote(true)
    
    let isNear = false
    if (userLocation) {
      const dist = L.latLng(userLocation[0], userLocation[1]).distanceTo(
        L.latLng(m.position[0], m.position[1])
      )
      isNear = dist <= 100
    }

    try {
      await loanService.createLoanNote({
        loanId: l.id,
        customerId: l.customerId,
        note: note,
        isNear,
      })
      toast.success('Тэмдэглэл хадгалагдлаа')
      setNote('')
    } catch (error) {
      toast.error((error as Error).message || 'Тэмдэглэл хадгалахад алдаа гарлаа')
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleToggleValid = async () => {
    try {
      const fieldMap: Record<string, keyof UpdateCustomerRequest> = {
        location: 'locationValid',
        work: 'workValid',
        current: 'currentValid',
        additional: 'additionalValid',
      }

      const fieldName = fieldMap[m.type]
      
      const updateData: UpdateCustomerRequest = {
        [fieldName]: !m.isValid
      }

      if (l.customer?.id) {
         await customerService.updateCustomer(l.customer.id, updateData)
         toast.success('Хаягийн төлөв шинэчлэгдлээ')
         onRefresh?.()
      }
    } catch (error) {
      toast.error((error as Error).message || 'Төлөв шинэчлэхэд алдаа гарлаа')
    }
  }

  return (
    <Marker key={m.id} position={m.position} icon={getMarkerIcon(l, m.type, m.isValid)}>
      <Popup maxWidth={320}>
        <div className='space-y-4 p-1'>
          <div className='flex items-start justify-between gap-2 border-b pb-2'>
            <div>
              <p className='font-bold text-sm'>Зээл #{l.loanId}</p>
              <p className='text-muted-foreground text-xs'>
                {l.customer?.lastName} {l.customer?.firstName}
              </p>
            </div>
            <Badge variant={status.variant} className='text-[10px]'>
              {l.status}
            </Badge>
          </div>

          <div className='grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-black'>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] uppercase'>Утас</span>
              <span className='font-medium'>{l.customer?.phoneNumber}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] uppercase'>Олгосон</span>
              <span className='font-medium'>{formatCurrency(l.loanAmount)}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] uppercase'>Төлөх дүн</span>
              <span className='font-bold text-orange-600'>{formatCurrency(l.payAmount)}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-[10px] uppercase'>Хэтэрсэн</span>
              <span className='font-bold text-red-600'>{l.overdueDay} хоног</span>
            </div>
            <div className='col-span-2 flex flex-col'>
              <span className='text-muted-foreground text-[10px] uppercase'>
                {getAddressTypeLabel(m.type)}
              </span>
              <span className='leading-tight'>{l.customer?.address || 'Хаяг байхгүй'}</span>
            </div>
          </div>

          <div className='space-y-2 border-t pt-2'>
            <Textarea 
              placeholder='Тэмдэглэл бичих...' 
              className='text-xs h-16 min-h-16' 
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className='flex gap-2'>
              <Button size='sm' className='flex-1 h-8 text-[11px]' onClick={handleSaveNote} disabled={isSavingNote}>
                <Save className='w-3 h-3 mr-1' /> {isSavingNote ? '...' : 'Хадгалах'}
              </Button>
              <Button 
                size='sm' 
                variant={m.isValid ? 'outline' : 'destructive'} 
                className='flex-1 h-8 text-[11px]'
                onClick={handleToggleValid}
              >
                {m.isValid ? <XCircle className='w-3 h-3 mr-1' /> : <CheckCircle className='w-3 h-3 mr-1' />}
                {m.isValid ? 'Буруу хаяг' : 'Хаяг зөв'}
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Button 
              size='sm' 
              variant='secondary' 
              className='h-8 text-[11px]'
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${m.position[0]},${m.position[1]}`, '_blank')}
            >
              <ExternalLink className='w-3 h-3 mr-1' /> Google Maps
            </Button>
            <Button 
              size='sm' 
              variant='outline' 
              className='h-8 text-[11px]'
              onClick={() => onEdit(l)}
            >
              <Edit className='w-3 h-3 mr-1' /> Засах
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
