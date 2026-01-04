import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { LoanStatus } from '@/services'
import { loanStatusService } from '@/services'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { LoanStatusFormDialog } from './components/dialogs'
import { LoanStatusDetailContent } from './components/loan-status-detail-content'
import { LoanStatusToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/loans/status/')

export function LoanStatusPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleIdClick = (loanStatus: LoanStatus) => {
    openDrawer({
      title: 'Зээлийн төлөв',
      description: 'Зээлийн төлөвүүдийг үнэлэх',
      content: <LoanStatusDetailContent loanStatus={loanStatus} />,
    })
  }

  const columns = useMemo(
    () => createColumns({ onIdClick: handleIdClick }),
    [openDrawer]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const {
    data: list,
    refetch,
    isLoading: isLoadingLoanStatuses,
  } = useQuery({
    queryKey: [QUERY_KEYS.LOAN_STATUS_LIST, params],
    queryFn: async () => {
      try {
        const res = await loanStatusService.listLoanStatuses(params)
        if (import.meta.env.DEV) {
          console.log('Loan Statuses API response:', res)
        }
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loan statuses:', error)
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
        <LoanStatusToolbarActions
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
      <BaseTable<LoanStatus>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingLoanStatuses}
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
            title='Зээлийн төлөв'
            description='Зээлийн төлөвүүдийг үнэлэх'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        CreateComponent={LoanStatusFormDialog}
        UpdateComponent={LoanStatusFormDialog}
      />
    </Main>
  )
}
