import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { newsService } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { useServerlessPagination } from '@/hooks/use-serverless-pagination'
import { ServerlessTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { TABLE_CONFIG } from './components/constants'
import { NewsDeleteDialog, NewsDialogs } from './components/dialogs'
import { NewsToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/additional/news/')

export function News() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(() => createColumns(), [])

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const lastEvaluatedKeyFromUrl = useMemo(() => {
    const key = search.lastEvaluatedKey
    if (!key) return undefined
    if (typeof key === 'string') {
      try {
        return JSON.parse(key) as Record<string, unknown>
      } catch {
        return key
      }
    }
    return key as Record<string, unknown>
  }, [search.lastEvaluatedKey])

  const {
    data: list,
    refetch,
    isLoading: isLoadingNews,
  } = useQuery({
    queryKey: ['news-list', params, lastEvaluatedKeyFromUrl],
    queryFn: async () => {
      const requestParams: Parameters<typeof newsService.listNews>[0] = {
        ...params,
      }
      if (lastEvaluatedKeyFromUrl) {
        requestParams.lastEvaluatedKey = lastEvaluatedKeyFromUrl
      }
      const res = await newsService.listNews(requestParams)
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
        lastEvaluatedKey: res?.body?.lastEvaluatedKey,
      }
    },
    retry: 1,
    throwOnError: false,
  })

  const { hasNextPage, currentPage, handleNextPage, handlePreviousPage } =
    useServerlessPagination({
      lastEvaluatedKeyFromResponse: list?.lastEvaluatedKey,
      lastEvaluatedKeyFromUrl: lastEvaluatedKeyFromUrl,
      currentPageFromUrl: search.page,
      navigate,
      storageKey: 'news-list',
    })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <NewsToolbarActions
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
      <ServerlessTable
        data={list?.items ?? []}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingNews}
        UpdateComponent={({ open, onClose, onSuccess, data }) => (
          <NewsDialogs.NewsForm
            open={open}
            onClose={onClose}
            onSuccess={() => {
              onSuccess?.()
            }}
            data={data}
          />
        )}
        DeleteComponent={NewsDeleteDialog}
        header={
          <TableHeader
            title='News'
            description='Manage news articles and announcements'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        hasNextPage={hasNextPage}
        currentPage={currentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
    </Main>
  )
}
