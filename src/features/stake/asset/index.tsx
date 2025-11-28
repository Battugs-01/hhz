import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { stakeService } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { useServerlessPagination } from '@/hooks/use-serverless-pagination'
import { ServerlessTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { StakeAssetDialogs } from './components/dialogs'
import { StakeAssetToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/stake/asset/')

export function StakeAsset() {
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
    data: assetList,
    refetch,
    isLoading: isLoadingAssets,
  } = useQuery({
    queryKey: [QUERY_KEYS.STAKE_ASSET_LIST, params, lastEvaluatedKeyFromUrl],
    queryFn: async () => {
      try {
        const requestParams: Parameters<
          typeof stakeService.listStakeAssets
        >[0] = {}
        if (lastEvaluatedKeyFromUrl) {
          requestParams.lastEvaluatedKey = lastEvaluatedKeyFromUrl
        }
        const res = await stakeService.listStakeAssets(requestParams)
        if (import.meta.env.DEV) {
          console.log('Stake Assets API response:', res)
        }
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
          lastEvaluatedKey: res?.body?.lastEvaluatedKey,
        }
      } catch (error) {
        console.error('Failed to fetch stake assets:', error)
        return {
          items: [],
          total: 0,
          lastEvaluatedKey: undefined,
        }
      }
    },
    retry: 1,
    throwOnError: false,
  })

  const { hasNextPage, currentPage, handleNextPage, handlePreviousPage } =
    useServerlessPagination({
      lastEvaluatedKeyFromResponse: assetList?.lastEvaluatedKey,
      lastEvaluatedKeyFromUrl: lastEvaluatedKeyFromUrl,
      currentPageFromUrl: search.page,
      navigate,
      storageKey: 'stake-asset-list',
    })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <StakeAssetToolbarActions
          search={{
            start_day:
              typeof search.start_day === 'string'
                ? search.start_day
                : undefined,
            end_day:
              typeof search.end_day === 'string' ? search.end_day : undefined,
          }}
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
        data={assetList?.items ?? []}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingAssets}
        UpdateComponent={({ open, onClose, onSuccess, data }) => (
          <StakeAssetDialogs.StakeAssetForm
            open={open}
            onClose={onClose}
            onSuccess={() => {
              onSuccess?.()
            }}
            data={data}
          />
        )}
        header={
          <TableHeader
            title='Stake Assets'
            description='Manage staking assets and configurations'
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
