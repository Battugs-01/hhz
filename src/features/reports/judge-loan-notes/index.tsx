import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { useDrawer } from '@/context/drawer-provider'
import { JudgeLoanDetailContent } from '@/features/judge/district-loans/components/judge-loan-detail'
import { useFilterParams } from '@/hooks/use-filter-params'
import { JudgeLoan, JudgeLoanNote, noteService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useMemo } from 'react'
import { NoteToolbarActions } from '../loan-notes/components/toolbar-actions'
import { createColumns } from './components/columns'
import { JUDGE_LOAN_NOTE_FILTER_FIELDS, JUDGE_LOAN_NOTE_FILTER_KEYS } from './constants'

const route = getRouteApi('/_authenticated/reports/judge-loan-notes')

const TABLE_CONFIG = {
  ID: 'judge-loan-notes-table',
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_KEY: 'query',
  SEARCH_PLACEHOLDER: 'Тэмдэглэл хайх...',
  EXPORT_FILE_NAME: 'judge-loan-notes-report',
}

export function JudgeLoanNotesPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleJudgeLoanClick = (judgeLoan: JudgeLoan) => {
    if (!judgeLoan) return
    openDrawer({
      title: 'Шүүхийн зээлийн дэлгэрэнгүй',
      description: `Код: ${judgeLoan.code}`,
      content: <JudgeLoanDetailContent record={judgeLoan} />,
    })
  }

  const columns = useMemo(
    () => createColumns({ onJudgeLoanClick: handleJudgeLoanClick }),
    [handleJudgeLoanClick]
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
    queryKey: ['judge-loan-notes-report', search],
    queryFn: async () => {
      try {
        const res = await noteService.listJudgeLoanNotes({
          ...params,
          judgeLoanId: search.judgeLoanId ? Number(search.judgeLoanId) : undefined,
          customerId: search.customerId ? Number(search.customerId) : undefined,
          createdBy: search.createdBy ? Number(search.createdBy) : undefined,
          phoneNumber: search.phoneNumber,
          registerNumber: search.registerNumber,
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
        console.error('Failed to fetch judge loan notes report:', error)
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
          fields={JUDGE_LOAN_NOTE_FILTER_FIELDS}
          filterKeys={JUDGE_LOAN_NOTE_FILTER_KEYS}
          tableId={TABLE_CONFIG.ID}
          exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<JudgeLoanNote>
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
            title='Шүүхийн зээлийн тэмдэглэл'
            description={`Шүүхийн зээлийн тэмдэглэлийн жагсаалт (Нийт: ${reportData?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        rowKey='id'
      />
    </Main>
  )
}
