import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { type UserListType, kycService } from '@/services'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { QUERY_KEYS } from './constants'
import { UserDetailSelectContent } from './user-detail-select-content'
import { AuthenticationTab } from './user-detail-tabs/authentication-tab'
import { BasicInformationTab } from './user-detail-tabs/basic-information-tab'
import { NetAssetsTab } from './user-detail-tabs/net-assets-tab'

type UserDetailPageProps = {
  userId: string
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const navigate = useNavigate()
  const [selectedOption, setSelectedOption] = useState('Asset')

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_INFORMATION_DETAIL, userId],
    queryFn: async () => {
      const res = await kycService.listUsers({ id: userId, pageSize: 1 })
      return res?.body?.items?.[0] as UserListType | undefined
    },
    enabled: !!userId,
    retry: 1,
    throwOnError: false,
  })

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-muted-foreground'>Loading...</div>
        </div>
      </Main>
    )
  }

  if (error || !user) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center justify-center py-12'>
          <div className='text-muted-foreground'>User not found</div>
        </div>
      </Main>
    )
  }

  const selectOptions = [
    'Asset',
    'Internal Deposit',
    'Internal Withdraw',
    'Bank Deposit',
    'Bank Withdraw',
    'Deposit',
    'Withdraw',
    'P2P orders',
    'Security',
    'Orders',
    'Addresses',
    'Auth Log',
    'Changes Log',
    'Withdraw Ban',
  ]

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            navigate({
              to: '/user-information',
            })
          }}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <TableHeader
          title='User Details'
          description='View detailed information about the user'
        />
      </div>

      <Tabs defaultValue='basic-information' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='basic-information'>Basic Information</TabsTrigger>
          <TabsTrigger value='net-assets'>Net Assets</TabsTrigger>
          <TabsTrigger value='authentication'>
            Authentication Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic-information' className='mt-0'>
          <BasicInformationTab user={user} />
        </TabsContent>

        <TabsContent value='net-assets' className='mt-0'>
          <NetAssetsTab user={user} />
        </TabsContent>

        <TabsContent value='authentication' className='mt-0'>
          <AuthenticationTab user={user} />
        </TabsContent>
      </Tabs>

      <div className='mt-6 space-y-4'>
        <div>
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className='w-[250px]'>
              <SelectValue placeholder='Select an option' />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <UserDetailSelectContent
          selectedOption={selectedOption}
          userId={userId}
        />
      </div>
    </Main>
  )
}
