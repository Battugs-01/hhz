import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { kycService, type User } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { UserInformationToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/(user-management)/user-information/')

export function UserInformation() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(() => createColumns(navigate), [navigate])

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const {
    data: list,
    refetch,
    isLoading: isLoadingUsers,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_INFORMATION_LIST, params],
    queryFn: async () => {
      const res = await kycService.listUsers(params)
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
      }
    },
    retry: 1,
    throwOnError: false,
  })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      exportFileName: TABLE_CONFIG.EXPORT_FILE_NAME,
      extra: (table: any) => (
        <UserInformationToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
          table={table}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<User>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingUsers}
        tableConfig={{
          pagination: {
            defaultPage: TABLE_CONFIG.DEFAULT_PAGE,
            defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          },
          globalFilter: { enabled: false },
          columnFilters: [
            {
              columnId: 'email',
              searchKey: TABLE_CONFIG.SEARCH_KEY,
              type: 'string',
            },
          ],
        }}
        header={
          <TableHeader
            title='User Information'
            description='Manage user information and verification status'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
      />
    </Main>
  )
}
