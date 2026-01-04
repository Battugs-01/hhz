import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LocationButton } from '@/components/ui/location-button'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import type { LocationTabProps } from './types'

export function LocationTab({
  customer,
  location,
  setLocation,
  currentLocation,
  setCurrentLocation,
  workLocation,
  setWorkLocation,
  additionalLocation,
  setAdditionalLocation,
}: LocationTabProps) {
  return (
    <TabsContent value='location' className='mt-0 px-6 py-4'>
      <div className='space-y-4'>
        <h3 className='flex items-center gap-2 font-semibold'>
          <MapPin className='h-4 w-4' />
          Байршил засах
        </h3>

        <div className='bg-muted/30 space-y-4 rounded-lg p-4'>
          <div>
            <Label className='text-muted-foreground text-xs'>
              Гэрийн хаяг (зөвхөн харах)
            </Label>
            <p className='mt-1 text-sm font-medium'>
              {customer?.address || '-'}
            </p>
            <p className='text-muted-foreground text-xs'>
              {customer?.district}, {customer?.khoroo}
            </p>
          </div>

          <Separator />

          <div className='grid grid-cols-1 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>
                  Гэрийн байршил (уртраг өргөрөг)
                </Label>
                {location && (
                  <LocationButton location={location} label='Харах' />
                )}
              </div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='47.93106291964105 106.9649805649562'
                className='font-mono text-xs'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>
                  Одоо амьдарч байгаа (уртраг өргөрөг)
                </Label>
                {currentLocation && (
                  <LocationButton location={currentLocation} label='Харах' />
                )}
              </div>
              <Input
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder='47.93106291964105 106.9649805649562'
                className='font-mono text-xs'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>
                  Ажлын газрын байршил (уртраг өргөрөг)
                </Label>
                {workLocation && (
                  <LocationButton location={workLocation} label='Харах' />
                )}
              </div>
              <Input
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder='47.93106291964105 106.9649805649562'
                className='font-mono text-xs'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-xs'>
                  Нэмэлт байршил (уртраг өргөрөг)
                </Label>
                {additionalLocation && (
                  <LocationButton location={additionalLocation} label='Харах' />
                )}
              </div>
              <Input
                value={additionalLocation}
                onChange={(e) => setAdditionalLocation(e.target.value)}
                placeholder='47.93106291964105 106.9649805649562'
                className='font-mono text-xs'
              />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
