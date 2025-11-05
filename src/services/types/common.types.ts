/**
 * Base response type for all API responses
 */
export interface BaseResponse<T> {
  message: string
  body: T | null
}

/**
 * Pagination response type
 */
export interface PaginationResponse<T> {
  total: number
  items: Array<T>
}
