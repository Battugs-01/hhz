import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { kycService, type User } from '@/services'
import { UserPlus } from 'lucide-react'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { DateRangePicker } from '@/components/date-range-picker'
import { Main } from '@/components/layout/main'
import { columns } from './columns'
import { QUERY_KEYS, roles, statusOptions } from './constants'
import { UserDialogs } from './dialogs'

const route = getRouteApi('/_authenticated/(user-management)/kyc-info/')

export function KycInfo() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const { params, defaultDates, handleDateRangeChange } = useFilterParams(
    search,
    {
      defaultMonths: 3,
      defaultPageSize: 10,
      searchKey: 'email',
      navigate,
    }
  )

  const { data: list, refetch } = useQuery({
    queryKey: [QUERY_KEYS.KYC_INFO_LIST, params],
    queryFn: async () => {
      const res = await kycService.listUsers(params as Record<string, unknown>)
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
      }
    },
  })

  const handleCreateSuccess = useCallback(() => {
    setCreateOpen(false)
    refetch()
  }, [refetch])

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: 'ID or Email or Sub account id',
      searchKey: 'query',
      filters: [
        {
          columnId: 'status',
          title: 'Status',
          options: statusOptions as unknown as {
            label: string
            value: string
          }[],
        },
        {
          columnId: 'role',
          title: 'Role',
          options: roles.map((role) => ({ ...role })),
        },
      ],
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
        tableId='kyc-info-table'
        tableConfig={{
          pagination: { defaultPage: 1, defaultPageSize: 10 },
          globalFilter: { enabled: false },
          columnFilters: [
            { columnId: 'email', searchKey: 'email', type: 'string' },
            { columnId: 'status', searchKey: 'status', type: 'array' },
            { columnId: 'role', searchKey: 'role', type: 'array' },
          ],
        }}
        header={
          <TableHeader
            title='KYC Info'
            description='Manage user KYC information and verification status'
            createButtonLabel='Add User'
            createButtonIcon={<UserPlus className='h-4 w-4' />}
            onRefresh={() => refetch()}
            onCreate={() => setCreateOpen(true)}
          />
        }
        toolbar={toolbarConfig}
        UpdateComponent={UserDialogs.Form}
        DeleteComponent={UserDialogs.Delete}
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
