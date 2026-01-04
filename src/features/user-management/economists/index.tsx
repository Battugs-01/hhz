import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { economistService, type Economist } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { EconomistDialogs } from './components/dialogs'
import { EconomistsToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/(user-management)/economists/')

export function Economists() {
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
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.ECONOMIST_LIST, params],
    queryFn: async () => {
      try {
        const res = await economistService.listEconomists(params)
        if (import.meta.env.DEV) {
          console.log('Economists API response:', res)
        }
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch economists:', error)
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
        <EconomistsToolbarActions
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
      <BaseTable<Economist>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoading}
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
            title='Эдийн засагчид'
            description='Эдийн засагчийн жагсаалт болон удирдлага'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        CreateComponent={EconomistDialogs.Form}
        UpdateComponent={EconomistDialogs.Form}
        DeleteComponent={EconomistDialogs.Delete}
      />
    </Main>
  )
}
