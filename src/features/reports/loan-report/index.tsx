import {
  BaseTable,
  TableHeader,
} from '@/components/data-table'
import { Main } from '@/components/layout/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatCard } from '@/components/ui/stat-card'
import { useDrawer } from '@/context/drawer-provider'
import { createLoanColumns } from '@/features/branches/components/loan-columns'
import { LoanDialogs } from '@/features/loans/list/components/dialogs'
import { LoanDetailContent } from '@/features/loans/list/components/loan-detail'
import { LoanToolbarActions } from '@/features/loans/list/components/toolbar-actions'
import { useFilterParams } from '@/hooks/use-filter-params'
import type { Loan } from '@/services'
import { branchService, reportService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { FileText, Users } from 'lucide-react'
import { useMemo } from 'react'

const route = getRouteApi('/_authenticated/reports/loans')

const TABLE_CONFIG = {
  ID: 'loan-report-table',
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Нэр, регистр, утас, гэрээний дугаар...',
}

export function LoanReportPage() {
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

  const columns = useMemo(
    () => createLoanColumns({ onLoanClick: handleLoanClick }),
    [handleLoanClick]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const {
    data: reportData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['loan-report', params],
    queryFn: async () => {
      try {
        const res = await reportService.getLoanReport({
          ...params,
          loanAmount: search.loanAmount,
          loanAmount_operator: search.loanAmount_operator,
          overdueDay: search.overdueDay,
          overdueDay_operator: search.overdueDay_operator,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loan report:', error)
        return { items: [], total: 0 }
      }
    },
    staleTime: 30000,
  })

  // Fetch branches for filter
  const { data: branches } = useQuery({
    queryKey: ['branches-list'],
    queryFn: async () => {
      try {
        const res = await branchService.listBranches({ pageSize: 100 })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch branches:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  // Prepare branch options
  const branchOptions = useMemo(
    () =>
      branches?.map((branch) => ({
        label: branch.branch,
        value: branch.id.toString(),
      })) || [],
    [branches]
  )

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <div className='flex items-center gap-2'>
          <Select
            value={typeof search.branchId === 'string' ? search.branchId : undefined}
            onValueChange={(value) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  branchId: value === 'all' ? undefined : Number(value),
                  current: 1, // Reset to page 1
                }),
              })
            }}
          >
            <SelectTrigger className='w-[180px] h-8'>
              <SelectValue placeholder='Салбар сонгох' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Бүх салбар</SelectItem>
              {branchOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <LoanToolbarActions
            search={search}
            navigate={navigate}
            onDateRangeChange={handleDateRangeChange}
            onRefresh={refetch}
          />
        </div>
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch, branchOptions]
  )

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
  } = useQuery({
    queryKey: ['loan-report-dashboard', params],
    queryFn: async () => {
      try {
        const res = await reportService.getLoanDashboard({
          ...params,
          loanAmount: search.loanAmount,
          loanAmount_operator: search.loanAmount_operator,
          overdueDay: search.overdueDay,
          overdueDay_operator: search.overdueDay_operator,
        })
        return res?.data || { totalNotes: 0, totalCustomer: 0 }
      } catch (error) {
        console.error('Failed to fetch loan dashboard:', error)
        return { totalNotes: 0, totalCustomer: 0 }
      }
    },
    staleTime: 30000,
  })

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <StatCard
          icon={FileText}
          label='Нийт тэмдэглэл'
          value={dashboardData?.totalNotes ?? 0}
          isLoading={isDashboardLoading}
        />
        <StatCard
          icon={Users}
          label='Нийт харилцагч'
          value={dashboardData?.totalCustomer ?? 0}
          iconBgClass='bg-blue-500/10'
          iconClass='text-blue-500'
          isLoading={isDashboardLoading}
        />
      </div>
      <BaseTable<Loan>
        data={reportData?.items ?? []}
        total={reportData?.total}
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
          columnFilters: [{ columnId: 'query', searchKey: 'query', type: 'string' }],
        }}
        header={
          <TableHeader
            title='Зээлийн тайлан'
            description={`Зээлийн дэлгэрэнгүй тайлан (Нийт: ${reportData?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        rowKey='id'
        UpdateComponent={LoanDialogs.Update}
      />
    </Main>
  )
}
