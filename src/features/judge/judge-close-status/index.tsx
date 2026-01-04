import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { JudgeCloseStatus } from '@/services'
import { judgeCloseStatusService } from '@/services'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createJudgeCloseStatusColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { JudgeCloseStatusDialogs } from './components/dialogs'

const route = getRouteApi('/_authenticated/(judge)/judge-close-status/')

export function JudgeCloseStatusPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch judge close statuses
  const {
    data: judgeCloseStatusData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.JUDGE_CLOSE_STATUS_LIST,
      search.page,
      search.pageSize,
      search.query,
    ],
    queryFn: async () => {
      try {
        const res = await judgeCloseStatusService.listJudgeCloseStatuses({
          current: search.page || TABLE_CONFIG.DEFAULT_PAGE,
          pageSize: search.pageSize || TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          query: search.query,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch judge close statuses:', error)
        return { items: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 30000,
  })

  const columns = useMemo(() => createJudgeCloseStatusColumns(), [])

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<JudgeCloseStatus>
        data={judgeCloseStatusData?.items ?? []}
        total={judgeCloseStatusData?.total}
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
            title='Шүүхийн хаах төлөв'
            description='Шүүхийн хаах төлвийн жагсаалт'
          />
        }
        toolbar={{
          searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
          searchKey: TABLE_CONFIG.SEARCH_KEY,
          filters: [],
        }}
        onRefresh={refetch}
        rowKey='id'
        CreateComponent={JudgeCloseStatusDialogs.Form}
        UpdateComponent={JudgeCloseStatusDialogs.Form}
        DeleteComponent={JudgeCloseStatusDialogs.Delete}
      />
    </Main>
  )
}
