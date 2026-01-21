import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { useDrawer } from '@/context/drawer-provider'
import { LoanDetailContent } from '@/features/loans/list/components/loan-detail'
import { useFilterParams } from '@/hooks/use-filter-params'
import { Loan, LoanNote, noteService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'
import { createColumns } from './components/columns'
import { NoteToolbarActions } from './components/toolbar-actions'
import { LOAN_NOTE_FILTER_FIELDS, LOAN_NOTE_FILTER_KEYS } from './constants'

const route = getRouteApi('/_authenticated/reports/loan-notes')

const TABLE_CONFIG = {
  ID: 'loan-notes-table',
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Тэмдэглэл хайх...',
  EXPORT_FILE_NAME: 'loan-notes-report',
}

export function LoanNotesPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleLoanClick = (loan: Loan) => {
    if (!loan) return
    openDrawer({
      title: 'Зээлийн дэлгэрэнгүй',
      description: `Зээлийн ID: ${loan.loanId}`,
      content: <LoanDetailContent loan={loan} />,
    })
  }

  const columns = useMemo(
    () => createColumns({ onLoanClick: handleLoanClick }),
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
    queryKey: ['loan-notes-report', search],
    queryFn: async () => {
      try {
        const res = await noteService.listLoanNotes({
          ...params,
          loanId: search.loanId ? Number(search.loanId) : undefined,
          customerId: search.customerId ? Number(search.customerId) : undefined,
          createdBy: search.createdBy ? Number(search.createdBy) : undefined,
          phoneNumber: search.phoneNumber,
          registerNumber: search.registerNumber,
          isNear: search.isNear === 'true' ? true : search.isNear === 'false' ? false : undefined,
          sortDate: search.start_day || search.end_day ? {
            startDate: search.start_day,
            endDate: search.end_day,
          } : undefined,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loan notes report:', error)
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
        <NoteToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
          fields={LOAN_NOTE_FILTER_FIELDS}
          filterKeys={LOAN_NOTE_FILTER_KEYS}
          tableId={TABLE_CONFIG.ID}
          exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<LoanNote>
        data={reportData?.items ?? []}
        total={reportData?.total}
        columns={columns}
        search={search}
        navigate={navigate as any}
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
            title='Зээлийн тэмдэглэл'
            description={`Зээлийн тэмдэглэлийн жагсаалт (Нийт: ${reportData?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        rowKey='id'
      />
    </Main>
  )
}
