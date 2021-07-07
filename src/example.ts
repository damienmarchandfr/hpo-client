import { HPOClient } from '.'

const client = new HPOClient()

const list = client.getHPOList()
console.log(list)
