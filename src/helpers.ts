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
