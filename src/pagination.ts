/**
 * `max`: maximum number of items to get per request (-1 to disable pagination).
 * 
 * `page`: which page to get (any if max == -1) (starts at 1).
 */
export interface PaginationParams {
	max: number
	page: number
}

/**
 * `next`: true if it has a next page.
 * 
 * `values`: list of results.
 */
export interface PaginationResult<T> {
	next: boolean
	values: T[]
}
