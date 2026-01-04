import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { adminService, type Admin } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { AdminDialogs } from './components/dialogs'
import { AdminsToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/(user-management)/admins/')

export function Admins() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(() => createColumns(), [])

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const {
    data: list,
    refetch,
    isLoading: isLoadingAdmins,
  } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_LIST, params],
    queryFn: async () => {
      try {
        const res = await adminService.listAdmins(params)
        if (import.meta.env.DEV) {
          console.log('Admins API response:', res)
        }
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch admins:', error)
        return {
          items: [],
          total: 0,
        }
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
      extra: (
        <AdminsToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<Admin>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingAdmins}
        tableConfig={{
          pagination: {
            defaultPage: TABLE_CONFIG.DEFAULT_PAGE,
            defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          },
          globalFilter: { enabled: false },
          columnFilters: [
            {
              columnId: TABLE_CONFIG.SEARCH_KEY,
              searchKey: TABLE_CONFIG.SEARCH_KEY,
              type: 'string',
            },
          ],
        }}
        header={
          <TableHeader
            title='Админүүд'
            description='Админ хэрэглэгчид болон тэдний үүргийг удирдах'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        CreateComponent={AdminDialogs.Form}
        UpdateComponent={AdminDialogs.Form}
        DeleteComponent={AdminDialogs.Delete}
      />
    </Main>
  )
}
