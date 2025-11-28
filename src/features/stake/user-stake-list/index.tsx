import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  USERS_STAKE_STATUS,
  stakeService,
  type UserStakeList as UserStakeListType,
} from '@/services'
import { toast } from 'sonner'
import { useDrawer } from '@/context/drawer-provider'
import { useServerlessPagination } from '@/hooks/use-serverless-pagination'
import { ServerlessTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { UserStakeListToolbarActions } from './components/toolbar-actions'
import { UpdateStatusButton } from './components/update-status-button'
import { UserStakeDetailContent } from './components/user-stake-detail-content'

const route = getRouteApi('/_authenticated/stake/user-stake-list/')

export function UserStakeList() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()
  const queryClient = useQueryClient()

  const limitFromSearch =
    typeof search.limit === 'string'
      ? Number(search.limit)
      : typeof search.limit === 'number'
        ? search.limit
        : TABLE_CONFIG.DEFAULT_PAGE_SIZE

  const handleViewDetail = useCallback(
    (stake: UserStakeListType) => {
      openDrawer({
        title: 'User Stake Detail',
        description: 'View detailed information about this stake entry.',
        content: <UserStakeDetailContent stake={stake} />,
      })
    },
    [openDrawer]
  )

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      usersStakeId,
      status,
    }: {
      usersStakeId: string
      status: string
    }) => {
      return await stakeService.changeUserStakeStatus(usersStakeId, status)
    },
    onSuccess: () => {
      toast.success('Status updated successfully!')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_STAKE_LIST],
        exact: false,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status')
    },
  })

  const handleUpdateStatus = useCallback(
    async (usersStakeId: string, status: string) => {
      await updateStatusMutation.mutateAsync({ usersStakeId, status })
    },
    [updateStatusMutation]
  )

  const columns = useMemo(
    () => createColumns({ onRowClick: handleViewDetail }),
    [handleViewDetail]
  )

  const customActions = useCallback(
    (stake: UserStakeListType) => {
      const isCancelRequestedManual =
        stake.stakeStatus === USERS_STAKE_STATUS.CANCEL_REQUESTED_MANUAL

      if (!isCancelRequestedManual) return null

      return (
        <UpdateStatusButton
          usersStakeId={stake.id}
          onUpdateStatus={handleUpdateStatus}
        />
      )
    },
    [handleUpdateStatus]
  )

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
    data: userStakeList,
    refetch,
    isLoading: isLoadingUserStakes,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.USER_STAKE_LIST,
      lastEvaluatedKeyFromUrl,
      search.status,
      limitFromSearch,
    ],
    queryFn: async () => {
      try {
        const requestParams: Parameters<typeof stakeService.listUserStakes>[0] =
          {}
        if (lastEvaluatedKeyFromUrl) {
          requestParams.lastEvaluatedKey = lastEvaluatedKeyFromUrl
        }
        requestParams.limit = limitFromSearch
        if (search.status) {
          requestParams.status = search.status
        }
        const res = await stakeService.listUserStakes(requestParams)
        if (import.meta.env.DEV) {
          console.log('User Stake List API response:', res)
        }
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
          lastEvaluatedKey: res?.body?.lastEvaluatedKey,
        }
      } catch (error) {
        console.error('Failed to fetch user stake list:', error)
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
      lastEvaluatedKeyFromResponse: userStakeList?.lastEvaluatedKey,
      lastEvaluatedKeyFromUrl: lastEvaluatedKeyFromUrl,
      currentPageFromUrl: search.page,
      navigate,
      storageKey: 'user-stake-list',
    })

  const handleDateRangeChange = (range: {
    start_day?: string
    end_day?: string
  }) => {
    navigate({
      to: '/stake/user-stake-list',
      search: (prev) => ({
        ...prev,
        start_day: range.start_day,
        end_day: range.end_day,
      }),
    })
  }

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <UserStakeListToolbarActions
          search={{
            start_day:
              typeof search.start_day === 'string'
                ? search.start_day
                : undefined,
            end_day:
              typeof search.end_day === 'string' ? search.end_day : undefined,
            status:
              typeof search.status === 'string' ? search.status : undefined,
            limit:
              typeof search.limit === 'string'
                ? search.limit
                : String(limitFromSearch),
          }}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
        />
      ),
    }),
    [search, navigate, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <ServerlessTable
        data={userStakeList?.items ?? []}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingUserStakes}
        customActions={customActions}
        header={
          <TableHeader
            title='User Stake List'
            description='View all user staking records'
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
