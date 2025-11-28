import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cryptoService, type CryptoDeposit } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable } from '@/components/data-table'
import { createColumns as createCryptoDepositColumns } from '@/features/crypto/deposit/components/columns'

type DepositContentProps = {
  userId: string
}

export function DepositContent({ userId }: DepositContentProps) {
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

  const columns = useMemo(() => createCryptoDepositColumns(), [])

  const { data: list, isLoading: isLoadingCryptoDeposit } = useQuery({
    queryKey: ['user-crypto-deposit-history', userId, params],
    queryFn: async () => {
      const res = await cryptoService.listCryptoDeposits({
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
    <BaseTable<CryptoDeposit>
      data={list?.items ?? []}
      total={list?.total}
      columns={columns}
      search={search}
      navigate={navigate}
      tableId='user-crypto-deposit-history'
      isLoading={isLoadingCryptoDeposit}
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
