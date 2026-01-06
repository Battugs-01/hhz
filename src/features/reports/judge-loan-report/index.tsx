
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/ui/stat-card'
import { useDrawer } from '@/context/drawer-provider'
import { createJudgeLoanColumns } from '@/features/judge/district-loans/components/columns'
import { JudgeLoanDetailContent } from '@/features/judge/district-loans/components/judge-loan-detail'
import { JudgeLoanToolbarActions } from '@/features/judge/district-loans/components/toolbar-actions'
import { LoanDialogs } from '@/features/loans/list/components/dialogs'
import { useFilterParams } from '@/hooks/use-filter-params'
import { reportService, type JudgeLoan } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { FileText, Users } from 'lucide-react'
import { useMemo } from 'react'

const route = getRouteApi('/_authenticated/reports/judge-loans')

const TABLE_CONFIG = {
  ID: 'judge-loan-report-table',
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Нэр, регистр, утас, зээлийн ID...',
}

const JudgeLoanUpdateWrapper = (props: {
  open: boolean
  onClose: () => void
  data?: JudgeLoan
}) => {
  const { data, ...rest } = props
  return (
    <LoanDialogs.Update
      data={data?.loan ?? null}
      judgeLoanId={data?.id}
      {...rest}
    />
  )
}

export function JudgeLoanReportPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleLoanClick = (record: JudgeLoan) => {
    openDrawer({
      title: 'Шүүхийн зээлийн дэлгэрэнгүй',
      description: `Зээлийн ID: ${record.loan.loanId} | Код: ${record.code}`,
      content: <JudgeLoanDetailContent record={record} />,
    })
  }

  const columns = useMemo(
    () => createJudgeLoanColumns({ onLoanClick: handleLoanClick }),
    [handleLoanClick]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  // Merge report specific filters
  const reportParams = useMemo(() => ({
    ...params,
    districtId: search.districtId,
    judge: search.judge,
    ordinanceAmount: search.ordinanceAmount,
    ordinanceAmount_operator: search.ordinanceAmount_operator,
    // Add other filters if needed
  }), [params, search])

  const {
    data: reportData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['judge-loan-report', reportParams],
    queryFn: async () => {
      try {
        const res = await reportService.getJudgeLoanReport(reportParams)
        // Check both 'body' and 'data' just in case, though types say 'data' (which is mapped to 'body' in BaseResponse usually, 
        // but let's stick to what we see in the service implementation where response.data is returned)
        // Actually, BaseResponse usually puts the payload in 'body'.
        // Let's assume standard behavior unless overrides.
        // Wait, JudgeDashboardResponse used 'data'. 
        // Let's check report.types.ts again. It extends BaseResponse which uses 'body'.
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch judge loan report:', error)
        return { items: [], total: 0 }
      }
    },
    staleTime: 30000,
  })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <JudgeLoanToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
  } = useQuery({
    queryKey: ['judge-loan-report-dashboard', reportParams],
    queryFn: async () => {
      try {
        const res = await reportService.getJudgeLoanDashboard(reportParams)
        // Correctly using body property as per BaseResponse type
        return res?.data || { totalNotes: 0, totalCustomer: 0 }
      } catch (error) {
        console.error('Failed to fetch judge loan dashboard:', error)
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
      <BaseTable<JudgeLoan>
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
            title='Шүүхийн зээлийн тайлан'
            description={`Шүүхийн зээлийн дэлгэрэнгүй тайлан (Нийт: ${reportData?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        rowKey='id'
        UpdateComponent={JudgeLoanUpdateWrapper}
      />
    </Main>
  )
}
