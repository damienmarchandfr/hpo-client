import { PaginationParams, PaginationResult } from "./pagination"

export function checkHPOId(id: string) {
	const regex = /^HP:[0-9]*$/
	return !!id.match(regex)
}

export function checkOMIMId(id: string) {
	const regex = /^OMIM:[0-9]*$/
	return !!id.match(regex)
}

export function checkEntrezId(id: string) {
	const regex = /^[0-9]*$/
	return !!id.match(regex)
}

export function createPaginationUrl(url: string, pagination: PaginationParams | null) {
	const max = pagination?.max || -1
	const offset = max === -1 || !pagination ? 0 : Math.max(pagination.page - 1, 0)
	let cleanUrl = url.replace(/(&|\?)(max|offset)=[^&]*/g, '')

	cleanUrl += `${cleanUrl.includes('?') ? '&' : '?'}max=${max}&offset=${offset}`
	return cleanUrl
}

export function paginateResult<T>(values: T[], pagination: PaginationParams | null, totalValuesCount: number): PaginationResult<T> {
	if (!pagination) return { values, next: false }

	const page = Math.max(pagination.page, 1)
	return { values, next: pagination.max > -1 && pagination.max * page < totalValuesCount }
}
