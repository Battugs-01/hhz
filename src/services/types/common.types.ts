/**
 * Base response type for all API responses
 */
export interface BaseResponse<T> {
  message: string
  body: T | null
  code: number
  success: boolean
}

/**
 * Pagination response type
 */
export interface PaginationResponse<T> {
  list: Array<T>
  items: number // total count
}
