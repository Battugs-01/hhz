import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { kycService, type User } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { DateRangePicker } from '@/components/date-range-picker'
import { Main } from '@/components/layout/main'
import { createColumns } from './columns'
import { QUERY_KEYS } from './constants'
import { UserDialogs } from './dialogs'

const route = getRouteApi('/_authenticated/(user-management)/user-information/')

export function UserInformation() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const columns = useMemo(() => createColumns({ navigate }), [navigate])

  const { params, defaultDates, handleDateRangeChange } = useFilterParams(
    search,
    {
      defaultMonths: 3,
      defaultPageSize: 20,
      searchKey: 'email',
      navigate,
    }
  )

  const { data: list, refetch } = useQuery({
    queryKey: [QUERY_KEYS.USER_INFORMATION_LIST, params],
    queryFn: async () => {
      try {
        const res = await kycService.listUsers(
          params as Record<string, unknown>
        )
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
        }
      } catch (error) {
        console.error('Failed to fetch user information:', error)
        return {
          items: [],
          total: 0,
        }
      }
    },
    retry: 1,
  })

  const handleCreateSuccess = useCallback(() => {
    setCreateOpen(false)
    refetch()
  }, [refetch])

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: 'ID or Email or Sub account id',
      searchKey: 'email',
      filters: [],
      extra: handleDateRangeChange ? (
        <DateRangePicker
          value={{
            start_day: params.sortDate?.start_day || defaultDates.start_day,
            end_day: params.sortDate?.end_day || defaultDates.end_day,
          }}
          onChange={handleDateRangeChange}
          placeholder='Filter by date'
          className='w-[240px]'
        />
      ) : null,
    }),
    [handleDateRangeChange, params.sortDate, defaultDates]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<User>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId='user-information-table'
        tableConfig={{
          pagination: { defaultPage: 1, defaultPageSize: 20 },
          globalFilter: { enabled: false },
          columnFilters: [
            { columnId: 'email', searchKey: 'email', type: 'string' },
          ],
        }}
        header={
          <TableHeader
            title='User Information'
            fileName='user-information.xlsx'
            description='Manage user information and verification status'
            // createButtonLabel='Add User'
            // createButtonIcon={<UserPlus className='h-4 w-4' />}
            onRefresh={() => refetch()}
            // onCreate={() => setCreateOpen(true)}
          />
        }
        toolbar={toolbarConfig}
        // UpdateComponent={UserDialogs.Form}
        // DeleteComponent={UserDialogs.Delete}
        onRefresh={refetch}
      />

      <UserDialogs.Invite
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Main>
  )
}
