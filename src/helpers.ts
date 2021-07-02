export function checkHPOId(id: string) {
	const regex = /^HP:[0-9]*$/
	return !!id.match(regex)
}
