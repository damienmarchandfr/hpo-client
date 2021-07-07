import { HPOClient } from '.'

const client = new HPOClient()

const list = client.getHPOList()
// console.log(list)

client
	.search('a', 'terms', { max: 20, page: 1 }, false)
	.then((r) => {
		console.log(r)
	})
	.catch((err) => {
		console.error(err)
	})
