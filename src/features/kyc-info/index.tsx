import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KycInfoTable } from './components/kyc-info-table'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { usersService } from './data/service'

const route = getRouteApi('/_authenticated/kyc-info/')

export function KycInfo() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const params: Record<string, unknown> = {
    current: search.page || 1,
    pageSize: search.pageSize || 10,
    query: search.username || '',
  }
  const searchAny = search as any
  params.query = searchAny.email ?? searchAny.username ?? ''
  if (search.start_day || search.end_day) {
    params.sortDate = {
      start_day: search.start_day || '',
      end_day: search.end_day || '',
    }
  }

  const {
    data: list,
    isError,
    error,
  } = useQuery({
    queryKey: ['kyc-info', params],
    queryFn: async () => {
      const res = await usersService.list(params)
      return {
        items: res?.body?.items || [],
        total: res?.body?.total,
      }
    },
  })

  // Show error toast
  if (isError) {
    toast.error(error?.message || 'Failed to load users')
  }
  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>KYC info</h2>
          </div>
          <UsersPrimaryButtons />
        </div>
        <KycInfoTable
          data={list?.items ?? []}
          total={list?.total}
          search={search}
          navigate={navigate}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
