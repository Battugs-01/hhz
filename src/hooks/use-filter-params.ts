import dayjs from 'dayjs'

export interface FilterParamsOptions {
  /** Default огноо хугацаа (сар) */
  defaultMonths?: number
  /** Default хуудасны хэмжээ */
  defaultPageSize?: number
  /** Search key name (email, username, гэх мэт) */
  searchKey?: string
  /** Navigate function (date range handler-д шаардлагатай) */
  navigate?: (options: { search: any }) => void
}

export interface FilterParams {
  current: number
  pageSize: number
  query: string
  sortDate?: {
    start_day: string
    end_day: string
  }
  [key: string]: unknown
}

export interface UseFilterParamsReturn {
  params: FilterParams
  defaultDates: { start_day: string; end_day: string }
  handleDateRangeChange?: (range: {
    start_day?: string
    end_day?: string
  }) => void
}

/**
 * Дахин ашиглагдах filter params hook
 *
 * @example
 * const { params, defaultDates, handleDateRangeChange } = useFilterParams(search, {
 *   defaultMonths: 3,
 *   defaultPageSize: 10,
 *   searchKey: 'email',
 *   navigate
 * })
 */
export function useFilterParams(
  search: Record<string, unknown>,
  options: FilterParamsOptions = {}
): UseFilterParamsReturn {
  const {
    defaultMonths = 3,
    defaultPageSize = 10,
    searchKey = 'email',
    navigate,
  } = options

  // Default date range
  const getDefaultDates = () => {
    const today = dayjs()
    const monthsAgo = today.subtract(defaultMonths, 'month')
    return {
      start_day: monthsAgo.format('YYYY-MM-DD'),
      end_day: today.format('YYYY-MM-DD'),
    }
  }

  const defaultDates = getDefaultDates()

  // Build params
  const params: FilterParams = {
    current: (search.page as number) || 1,
    pageSize: (search.pageSize as number) || defaultPageSize,
    query: ((search[searchKey] as string) ?? (search.username as string)) || '',
  }

  // Add date range if needed
  if (search.start_day || search.end_day || defaultMonths > 0) {
    params.sortDate = {
      start_day: (search.start_day as string) || defaultDates.start_day,
      end_day: (search.end_day as string) || defaultDates.end_day,
    }
  }

  // Date range change handler
  const handleDateRangeChange = navigate
    ? (range: { start_day?: string; end_day?: string }) => {
        navigate({
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            start_day: range.start_day,
            end_day: range.end_day,
          }),
        })
      }
    : undefined

  return {
    params,
    defaultDates,
    handleDateRangeChange,
  }
}

/**
 * Default date range авах utility
 */
export function getDefaultDateRange(months: number = 3) {
  const today = dayjs()
  const monthsAgo = today.subtract(months, 'month')
  return {
    start_day: monthsAgo.format('YYYY-MM-DD'),
    end_day: today.format('YYYY-MM-DD'),
  }
}
