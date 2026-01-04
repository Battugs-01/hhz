import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { branchService, type Branch } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { BranchDialogs } from './components/dialogs'
import { BranchToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/branches/')

export function Branches() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const columns = useMemo(() => createColumns(), [])

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const { data: list, isLoading: isLoadingBranches } = useQuery({
    queryKey: [QUERY_KEYS.BRANCH_LIST, params],
    queryFn: async () => {
      try {
        const res = await branchService.listBranches(params)
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        return {
          items: [],
          total: 0,
        }
      }
    },
    retry: 1,
    throwOnError: false,
    staleTime: 30000, // 30 seconds
  })

  // Function to refresh both branch list and sidebar
  const handleRefresh = useCallback(() => {
    // Invalidate both queries
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANCH_LIST] })
    queryClient.invalidateQueries({ queryKey: ['sidebar-branches'] })
  }, [queryClient])

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <BranchToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={handleRefresh}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, handleRefresh]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<Branch>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingBranches}
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
            title='Салбар'
            description='Салбаруудын байршил болон мэдээллийг удирдах'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={handleRefresh}
        CreateComponent={BranchDialogs.Form}
        UpdateComponent={BranchDialogs.Form}
        DeleteComponent={BranchDialogs.Delete}
      />
    </Main>
  )
}
