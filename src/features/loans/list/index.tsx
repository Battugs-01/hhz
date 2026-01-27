import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/ui/stat-card'
import { useDrawer } from '@/context/drawer-provider'
import { createLoanColumns } from '@/features/branches/components/loan-columns'
import { useFilterParams } from '@/hooks/use-filter-params'
import { formatCurrency } from '@/lib/format-utils'
import type { Loan } from '@/services'
import { loanService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { AlertTriangle, Banknote, Calendar, DollarSign } from 'lucide-react'
import { useMemo } from 'react'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { LoanDialogs } from './components/dialogs'
import { LoanDetailContent } from './components/loan-detail'
import { LoanToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/loans/')

export function AllLoansPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleLoanClick = (loan: Loan) => {
    openDrawer({
      title: 'Зээлийн дэлгэрэнгүй',
      description: `Зээлийн ID: ${loan.loanId}`,
      content: <LoanDetailContent loan={loan} />,
    })
  }

  // Loan columns
  const columns = useMemo(
    () => createLoanColumns({ onLoanClick: handleLoanClick }),
    [openDrawer]
  )

  // Use filter params hook
  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  // Fetch summary statistics (no branchId = all branches)
  const summaryParams = useMemo(() => {
    const { current, pageSize, ...rest } = params
    return rest
  }, [params])

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['all-loans-summary', summaryParams],
    queryFn: async () => {
      try {
        const res = await loanService.getSummary(summaryParams as any)
        return res?.data || null
      } catch (error) {
        console.error('Failed to fetch summary:', error)
        return null
      }
    },
    retry: 1,
  })

  // Fetch all loans
  const {
    data: loansData,
    isLoading: isLoansLoading,
    refetch: refetchLoans,
  } = useQuery({
    queryKey: [QUERY_KEYS.LOAN_LIST, params],
    queryFn: async () => {
      try {
        const queryParams = { ...params }
        const res = await loanService.listLoans(queryParams as any)
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loans:', error)
        return { items: [], total: 0 }
      }
    },
    retry: 1,
  })

  // Toolbar config
  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <LoanToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetchLoans}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetchLoans]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Statistics cards */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <StatCard
          icon={Banknote}
          label='Нийт зээл'
          value={summary?.totalLoans ?? 0}
          isLoading={isSummaryLoading}
        />
        <StatCard
          icon={Calendar}
          label='Хэтэрсэн'
          value={summary?.overdueLoans ?? 0}
          iconBgClass='bg-orange-500/10'
          iconClass='text-orange-500'
          valueClass='text-orange-500'
          isLoading={isSummaryLoading}
        />
        <StatCard
          icon={DollarSign}
          label='Нийт дүн'
          value={formatCurrency(summary?.totalLoanAmount ?? 0)}
          iconBgClass='bg-green-500/10'
          iconClass='text-green-500'
          isLoading={isSummaryLoading}
          skeletonWidth='w-24'
        />
        <StatCard
          icon={AlertTriangle}
          label='Онцгой хэтэрсэн'
          value={summary?.severelyOverdueLoans ?? 0}
          iconBgClass='bg-red-500/10'
          iconClass='text-red-500'
          valueClass='text-red-500'
          isLoading={isSummaryLoading}
        />
      </div>

      {/* Loans table */}
      <BaseTable<Loan>
        data={loansData?.items ?? []}
        total={loansData?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoansLoading}
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
            title='Бүх зээлүүд'
            description={`Бүх салбарын зээлийн жагсаалт (Нийт: ${loansData?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetchLoans}
        rowKey='id'
        UpdateComponent={LoanDialogs.Update}
      />
    </Main>
  )
}
