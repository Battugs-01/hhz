import { type UserListType } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/copy-button'

type BasicInformationTabProps = {
  user: UserListType
}

export function BasicInformationTab({ user }: BasicInformationTabProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

  return (
    <div className='bg-card rounded-lg border p-6'>
      <div className='space-y-4'>
        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>User ID</div>
          <div className='col-span-2 flex items-center gap-2'>
            <span className='font-mono text-sm'>{maskValue(user.id)}</span>
            <CopyButton value={user.id} />
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Name</div>
          <div className='col-span-2'>{fullName || 'N/A'}</div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>SubAccount ID</div>
          <div className='col-span-2 flex items-center gap-2'>
            <span className='font-mono text-sm'>
              {maskValue(user.subAccountId)}
            </span>
            <CopyButton value={user.subAccountId} />
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Email Login</div>
          <div className='col-span-2 flex items-center gap-2'>
            <span>{user.email}</span>
            <CopyButton value={user.email} />
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>VIP Level</div>
          <div className='col-span-2'>
            <Badge variant='outline'>{user.vipLevel}</Badge>
          </div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>
            Time of Registration
          </div>
          <div className='col-span-2'>{formatDate(user.created_at)}</div>
        </div>

        <div className='border-border grid grid-cols-3 gap-4 border-b pb-3'>
          <div className='text-muted-foreground font-medium'>Kyc status</div>
          <div className='col-span-2'>
            <Badge variant={user.kycLevel > 0 ? 'success' : 'error'}>
              {user.kycLevel > 0 ? 'SUCCESS' : 'PENDING'}
            </Badge>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          <Button variant='outline' size='sm'>
            KYC reset
          </Button>
          <Button variant='outline' size='sm'>
            Email change
          </Button>
          <Button variant='outline' size='sm'>
            Withdraw Status: {user.canWithdraw ? 'Active' : 'Inactive'}
          </Button>
        </div>
      </div>
    </div>
  )
}
