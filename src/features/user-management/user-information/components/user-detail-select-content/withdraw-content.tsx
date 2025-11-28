import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cryptoService, type CryptoWithdrawal } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable } from '@/components/data-table'
import { createColumns as createCryptoWithdrawalColumns } from '@/features/crypto/withdrawal/components/columns'

type WithdrawContentProps = {
  userId: string
}

export function WithdrawContent({ userId }: WithdrawContentProps) {
  const [search, setSearch] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 20,
    query: userId,
  })

  useEffect(() => {
    setSearch((prev) => ({
      ...prev,
      query: userId,
    }))
  }, [userId])

  const navigate = (options: {
    search:
      | true
      | Record<string, unknown>
      | ((prev: Record<string, unknown>) => Record<string, unknown>)
  }) => {
    if (options.search === true) {
      return
    }
    if (typeof options.search === 'function') {
      const searchFn = options.search
      setSearch((prev) => {
        const newSearch = searchFn(prev) as Record<string, unknown>
        return {
          ...newSearch,
          query: userId,
        }
      })
    } else if (typeof options.search === 'object') {
      setSearch({
        ...options.search,
        query: userId,
      })
    }
  }

  const { params } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: 20,
    searchKey: 'query',
    navigate,
  })

  const columns = useMemo(() => createCryptoWithdrawalColumns(), [])

  const { data: list, isLoading: isLoadingCryptoWithdrawal } = useQuery({
    queryKey: ['user-crypto-withdrawal-history', userId, params],
    queryFn: async () => {
      const res = await cryptoService.listCryptoWithdrawals({
        query: userId,
        current: params.current,
        pageSize: params.pageSize,
      })
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
      }
    },
    enabled: !!userId,
    retry: 1,
    throwOnError: false,
  })

  return (
    <BaseTable<CryptoWithdrawal>
      data={list?.items ?? []}
      total={list?.total}
      columns={columns}
      search={search}
      navigate={navigate}
      tableId='user-crypto-withdrawal-history'
      isLoading={isLoadingCryptoWithdrawal}
      tableConfig={{
        pagination: {
          defaultPage: 1,
          defaultPageSize: 20,
        },
        globalFilter: { enabled: false },
      }}
      hideToolbar
    />
  )
}
