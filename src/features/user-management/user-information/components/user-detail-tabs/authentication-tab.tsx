import { type UserListType } from '@/services'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type AuthenticationTabProps = {
  user: UserListType
}

export function AuthenticationTab({ user }: AuthenticationTabProps) {
  // Placeholder data - can be enhanced with real API data later
  const isVerified = user.kycLevel > 0
  const antiPhishingCode = 'n/a'
  const antiPhishingLastUpdated = '0'
  const antiPhishingStatus = false
  const lastChangedEmail = 'n/a'
  const lastUpdatedEmail = '0'
  const phoneNumber = '+97695614460' // Placeholder
  const smsCountryCode = '+976'
  const smsLastUpdated = '1758859439088'

  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='space-y-4'>
        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Status</div>
          <div className='col-span-2'>
            <Badge variant={isVerified ? 'success' : 'error'}>
              {isVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>

        <div className='border-border space-y-2 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>
            Anti-phishing:
          </div>
          <div className='grid grid-cols-3 gap-4 pl-4'>
            <div className='text-muted-foreground text-sm'>code:</div>
            <div className='col-span-2 text-sm'>{antiPhishingCode}</div>
            <div className='text-muted-foreground text-sm'>last-updated:</div>
            <div className='col-span-2 text-sm'>{antiPhishingLastUpdated}</div>
            <div className='text-muted-foreground text-sm'>status:</div>
            <div className='col-span-2'>
              {antiPhishingStatus ? (
                <Badge variant='success'>Active</Badge>
              ) : (
                <X className='text-destructive inline h-4 w-4' />
              )}
            </div>
          </div>
        </div>

        <div className='border-border space-y-2 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Email:</div>
          <div className='grid grid-cols-3 gap-4 pl-4'>
            <div className='text-muted-foreground text-sm'>
              last-changed-email:
            </div>
            <div className='col-span-2 text-sm'>{lastChangedEmail}</div>
            <div className='text-muted-foreground text-sm'>last-updated:</div>
            <div className='col-span-2 text-sm'>{lastUpdatedEmail}</div>
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Phone-number:</div>
          <div className='col-span-2 text-sm'>{phoneNumber}</div>
        </div>

        <div className='space-y-2'>
          <div className='text-muted-foreground font-medium'>SMS:</div>
          <div className='grid grid-cols-3 gap-4 pl-4'>
            <div className='text-muted-foreground text-sm'>country-code:</div>
            <div className='col-span-2 text-sm'>{smsCountryCode}</div>
            <div className='text-muted-foreground text-sm'>last-updated:</div>
            <div className='col-span-2 text-sm'>{smsLastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
