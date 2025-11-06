import { useCallback } from 'react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { FilterValues } from '@/components/filter-panel'

type UseFilterHandlersOptions = {
  navigate: NavigateFn
  filterKeys: readonly string[]
  dateRangeKeys?: readonly string[]
  resetPage?: boolean
}

export function useFilterHandlers({
  navigate,
  filterKeys,
  dateRangeKeys = [],
  resetPage = true,
}: UseFilterHandlersOptions) {
  const handleFilterChange = useCallback(
    (filters: FilterValues) => {
      navigate({
        search: (prev) => {
          const newSearch = { ...prev }

          filterKeys.forEach((key) => {
            if (filters[key] !== undefined) {
              newSearch[key] = filters[key] || undefined
            } else {
              delete newSearch[key]
            }
          })

          if (resetPage) {
            newSearch.page = 1
          }

          return newSearch
        },
        replace: false,
      })
    },
    [navigate, filterKeys, resetPage]
  )

  const handleClearFilters = useCallback(() => {
    navigate({
      search: (prev) => {
        const newSearch = { ...prev }

        filterKeys.forEach((key) => {
          delete newSearch[key]
        })

        dateRangeKeys.forEach((key) => {
          delete newSearch[key]
        })

        if (resetPage) {
          newSearch.page = 1
        }

        return newSearch
      },
      replace: false,
    })
  }, [navigate, filterKeys, dateRangeKeys, resetPage])

  return {
    handleFilterChange,
    handleClearFilters,
  }
}
