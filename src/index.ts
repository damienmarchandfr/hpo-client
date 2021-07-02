import { uid } from 'uid'
import axios, { AxiosInstance } from 'axios'
import { checkHPOId } from './helpers'
import https from 'https'
import { HpoTermDetails } from './responses'
import { clearInterval } from 'timers'

const BASE_URL = `https://hpo.jax.org/api/hpo`
const ID_LENGTH = 8
const NUMBER_REQUESTS_SECOND = 5

const test: HpoTermDetails[] = []

export class HPOClient {
	private stack: { id: string; done: boolean }[] = []
	private toExecId: string = ''
	private axiosInstance: AxiosInstance

	constructor() {
		this.axiosInstance = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		})
		this.run()
	}

	public run() {
		setTimeout(() => {
			const index = this.stack.findIndex((value) => {
				return !value.done
			})
			if (index > -1) {
				this.toExecId = this.stack[index].id
			} else {
				this.toExecId = ''
				console.log('Finish')
			}
			this.run()
		}, 5000)
	}

	/**
	 * Get hpo term details by ontology id.
	 */
	public async getHPOTermDetailsByOntologyId(
		ontologyId: string,
		immediately = false
	) {
		if (!checkHPOId(ontologyId)) {
			throw new Error(`NOP`)
		}

		const id = uid()
		if (!immediately) {
			this.stack.push({
				id,
				done: false,
			})

			await new Promise((resolve) => {
				const refreshId = setInterval(() => {
					if (this.toExecId === id) {
						clearInterval(refreshId)
						resolve(true)
					}
				}, 200)
			})
		}

		const url = `${BASE_URL}/term/${ontologyId.trim()}`
		const response = await this.axiosInstance.get(url)
		const data = response.data

		if (!immediately) {
			const index = this.stack.findIndex((value) => {
				return value.id === id
			})
			this.stack[index].done = true
		}

		return data as HpoTermDetails
	}
}

const client = new HPOClient()

client
	.getHPOTermDetailsByOntologyId('HP:0001166', true)
	.then(async (response) => {
		test.push(response)
		let r = await client.getHPOTermDetailsByOntologyId('HP:0001166', true)
		test.push(r)
		r = await client.getHPOTermDetailsByOntologyId('HP:0001166', true)
		test.push(r)
		r = await client.getHPOTermDetailsByOntologyId('HP:0001166', true)
		test.push(r)
		r = await client.getHPOTermDetailsByOntologyId('HP:0001166', true)
		test.push(r)
		r = await client.getHPOTermDetailsByOntologyId('HP:0001166')
		test.push(r)
		r = await client.getHPOTermDetailsByOntologyId('HP:0001166')
		test.push(r)
		console.log(test)
	})
