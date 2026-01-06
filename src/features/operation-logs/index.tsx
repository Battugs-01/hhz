import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { useFilterParams } from '@/hooks/use-filter-params'
import { operationLogService, type OperationLog } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { LogDetailDialog } from './components/log-detail-dialog'

const route = getRouteApi('/_authenticated/operation-logs')

export function OperationLogList() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(() => createColumns(), [])

  const { params } = useFilterParams(search, {
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
    queryKey: [QUERY_KEYS.OPERATION_LOG_LIST, params],
    queryFn: async () => {
      try {
        const res = await operationLogService.listOperationLogs({
          current: params.current,
          pageSize: params.pageSize,
          query: params.query,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (_error) {
        return {
          items: [],
          total: 0,
        }
      }
    },
    retry: 1,
  })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
    }),
    []
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<OperationLog>
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
            title='Лог бүртгэл'
            description='Системийн хэрэглэгчдийн үйлдэл болон хандалтын түүх'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        DetailComponent={LogDetailDialog}
      />
    </Main>
  )
}
