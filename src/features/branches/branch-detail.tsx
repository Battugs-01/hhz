import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from '@/components/ui/stat-card'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { formatCurrency } from '@/lib/format-utils'
import type { Loan } from '@/services'
import { loanService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { AlertTriangle, Banknote, Calendar, DollarSign } from 'lucide-react'
import { useMemo } from 'react'
import { LoanDialogs } from '../loans/list/components/dialogs'
import { LoanDetailContent } from '../loans/list/components/loan-detail'
import { BranchDetailToolbarActions } from './components/branch-detail-toolbar-actions'
import { LOAN_QUERY_KEYS, LOAN_TABLE_CONFIG } from './components/constants'
import { createLoanColumns } from './components/loan-columns'

const route = getRouteApi('/_authenticated/branches/$branchId')

export function BranchDetail() {
  const { branchId: branchIdParam } = route.useParams()
  const branchId = parseInt(branchIdParam)
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
    defaultPageSize: LOAN_TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: LOAN_TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  // Fetch summary statistics
  const summaryParams = useMemo(() => {
    const { current, pageSize, ...rest } = params
    return {
      ...rest,
      branchId,
    }
  }, [params, branchId])

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['branch-summary', summaryParams],
    queryFn: async () => {
      try {
        const res = await loanService.getSummary(summaryParams as any)
        return res?.data || null
      } catch (error) {
        console.error('Failed to fetch summary:', error)
        return null
      }
    },
    enabled: !isNaN(branchId),
    retry: 1,
  })

  // Fetch loans for this branch
  const {
    data: loansData,
    isLoading: isLoansLoading,
    refetch: refetchLoans,
  } = useQuery({
    queryKey: [LOAN_QUERY_KEYS.BRANCH_LOANS, branchId, params],
    queryFn: async () => {
      try {
        const res = await loanService.listLoans({
          ...params,
          branchId: branchId,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loans:', error)
        return { items: [], total: 0 }
      }
    },
    enabled: !isNaN(branchId),
    retry: 1,
  })

  // Toolbar config for loans table
  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: LOAN_TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: LOAN_TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <BranchDetailToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetchLoans}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetchLoans]
  )

  if (isSummaryLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-4 w-96' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-24 w-full' />
          </CardContent>
        </Card>
      </Main>
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Branch header */}

      {/* Statistics cards */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <StatCard
          icon={Banknote}
          label='Нийт зээл'
          value={summary?.totalLoans ?? 0}
        />
        <StatCard
          icon={Calendar}
          label='Хэтэрсэн'
          value={summary?.overdueLoans ?? 0}
          iconBgClass='bg-orange-500/10'
          iconClass='text-orange-500'
          valueClass='text-orange-500'
        />
        <StatCard
          icon={DollarSign}
          label='Нийт дүн'
          value={formatCurrency(summary?.totalLoanAmount ?? 0)}
          iconBgClass='bg-green-500/10'
          iconClass='text-green-500'
        />
        <StatCard
          icon={AlertTriangle}
          label='Онцгой хэтэрсэн'
          value={summary?.severelyOverdueLoans ?? 0}
          iconBgClass='bg-red-500/10'
          iconClass='text-red-500'
          valueClass='text-red-500'
        />
      </div>

      {/* Loans table */}
      <BaseTable<Loan>
        data={loansData?.items ?? []}
        total={loansData?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={LOAN_TABLE_CONFIG.ID}
        isLoading={isLoansLoading}
        tableConfig={{
          pagination: {
            defaultPage: LOAN_TABLE_CONFIG.DEFAULT_PAGE,
            defaultPageSize: LOAN_TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          },
          globalFilter: { enabled: false },
          columnFilters: [
            {
              columnId: LOAN_TABLE_CONFIG.SEARCH_KEY,
              searchKey: LOAN_TABLE_CONFIG.SEARCH_KEY,
              type: 'string',
            },
          ],
        }}
        header={
          <TableHeader
            title='Салбарын зээлүүд'
            description={`Зээлийн жагсаалт (Нийт: ${loansData?.total || 0})`}
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
