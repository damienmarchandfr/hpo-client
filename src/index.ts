import { uid } from 'uid'
import axios, { AxiosInstance } from 'axios'
import { checkHPOId } from './helpers'
import https from 'https'
import {
	DiseaseAssociations,
	GeneAssociations,
	HpoTermDetails,
	IntersectingDiseaseAssociations,
} from './responses'
import { clearInterval } from 'timers'

const BASE_URL = `https://hpo.jax.org/api/hpo`
const NUMBER_REQUESTS_SECOND = 10

const test: HpoTermDetails[] = []

export class HPOClient {
	private stack: { id: string; done: boolean }[] = []
	private toExecId: string = ''
	private axiosInstance: AxiosInstance
	private nbrOfRequestPeedSecond = NUMBER_REQUESTS_SECOND

	constructor(config?: { nbrOfRequestPeedSecond?: number }) {
		if (
			config &&
			config.nbrOfRequestPeedSecond &&
			config.nbrOfRequestPeedSecond > NUMBER_REQUESTS_SECOND
		) {
			console.warn(
				`⚠️  Your IP will be banned if nbrOfRequestPeedSecond > ${NUMBER_REQUESTS_SECOND}`
			)
		}

		this.axiosInstance = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		})
		this.nbrOfRequestPeedSecond =
			config?.nbrOfRequestPeedSecond || NUMBER_REQUESTS_SECOND
		this.run()
	}

	private run() {
		setTimeout(() => {
			const index = this.stack.findIndex((value) => {
				return !value.done
			})
			if (index > -1) {
				this.toExecId = this.stack[index].id
			} else {
				this.toExecId = ''
			}
			this.run()
		}, 1000 / this.nbrOfRequestPeedSecond)
	}

	//---------------- TERMS ------------------

	/**
	 * Get hpo term details by ontology id.
	 * https://hpo.jax.org/api/hpo/term/HP%3A0001166
	 */
	public async getHPOTermDetailsByOntologyId(
		ontologyId: string,
		immediately = false
	) {
		if (!ontologyId) return null

		if (!checkHPOId(ontologyId)) {
			throw new Error(`Invalid id ${ontologyId}`)
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
				}, 30)
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

	/**
	 * Get a list of intersecting disease associations for a set of terms
	 * https://hpo.jax.org/api/hpo/term/intersecting?q=HP%3A0000365%2CHP%3A0006385
	 */
	public async getAListOfIntersectingDiseaseAssociations(
		ontologyIdIds: string[],
		immediately = false
	) {
		if (!ontologyIdIds?.length) return null

		for (const ontologyId of ontologyIdIds) {
			if (!checkHPOId(ontologyId)) {
				throw new Error(`Invalid id ${ontologyId}`)
			}
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
				}, 30)
			})
		}

		// intersecting?q=HP%3A0000365%2CHP%3A0006385
		const concat = ontologyIdIds.join(',')

		const url = `${BASE_URL}/term/intersecting?q=${concat}`
		const response = await this.axiosInstance.get(url)
		const data = response.data

		if (!immediately) {
			const index = this.stack.findIndex((value) => {
				return value.id === id
			})
			this.stack[index].done = true
		}

		return data as IntersectingDiseaseAssociations
	}

	/**
	 * Get gene associations for a specific term
	 * https://hpo.jax.org/api/hpo/term/HP%3A0001166/genes?max=-1&offset=1
	 *
	 */
	public async getGeneAssociations(ontologyId: string, immediately = false) {
		if (!ontologyId) return null

		if (!checkHPOId(ontologyId)) {
			throw new Error(`Invalid id ${ontologyId}`)
		}

		// /term/HP%3A0001166/genes
		const url = `${BASE_URL}/term/${ontologyId}/genes?max=-1&offset=1`

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
				}, 30)
			})
		}

		const response = await this.axiosInstance.get(url)
		const data = response.data

		if (!immediately) {
			const index = this.stack.findIndex((value) => {
				return value.id === id
			})
			this.stack[index].done = true
		}

		return data as GeneAssociations
	}

	/**
	 * Get disease associations for a specific term
	 * https://hpo.jax.org/api/hpo/term/HP%3A0001166/diseases?max=-1&offset=1
	 */
	public async getDiseasesAssociations(
		ontologyId: string,
		immediately = false
	) {
		if (!ontologyId) return null

		if (!checkHPOId(ontologyId)) {
			throw new Error(`Invalid id ${ontologyId}`)
		}

		// /term/HP%3A0001166/genes
		const url = `${BASE_URL}/term/${ontologyId}/diseases?max=-1&offset=1`

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
				}, 30)
			})
		}

		const response = await this.axiosInstance.get(url)
		const data = response.data

		if (!immediately) {
			const index = this.stack.findIndex((value) => {
				return value.id === id
			})
			this.stack[index].done = true
		}

		return data as DiseaseAssociations
	}

	// ------------------ SEARCH -------------------

	/**
	 * Search terms, diseases and genes
	 * https://hpo.jax.org/api/hpo/search/?q=arach&max=-1&offset=0&category=terms
	 */
	public async search(
		search: string,
		category: 'terms' | 'genes' | 'diseases',
		immediately = false
	) {
		if (!search) {
			return null
		}

		const q = search.toLowerCase().trim()

		const url = `${BASE_URL}/search/?q=${q}&max=-1&offset=0&category=${category}`

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
				}, 30)
			})
		}

		const response = await this.axiosInstance.get(url)
		const data = response.data

		if (!immediately) {
			const index = this.stack.findIndex((value) => {
				return value.id === id
			})
			this.stack[index].done = true
		}

		return data as DiseaseAssociations

	}
}
