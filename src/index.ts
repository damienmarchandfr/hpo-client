import { uid } from 'uid'
import { checkEntrezId, checkHPOId, checkOMIMId } from './helpers'
import {
	Descendant,
	Disease,
	DiseaseAssociations,
	Gene,
	GeneAssociations,
	HpoTermDetails,
	IntersectingDiseaseAssociations,
	Search,
} from './responses'
import { clearInterval } from 'timers'
import { HTTPClient } from './HTTPClient'

const BASE_URL = `https://hpo.jax.org/api/hpo`
const NUMBER_REQUESTS_SECOND = 10

export class HPOClient extends HTTPClient {
	private stack: string[] = []
	private toExecId: string = ''
	private nbrOfRequestPerSecond = NUMBER_REQUESTS_SECOND

	constructor(config?: { nbrOfRequestPerSecond?: number }) {
		super()

		if (
			config &&
			config.nbrOfRequestPerSecond &&
			config.nbrOfRequestPerSecond > NUMBER_REQUESTS_SECOND
		) {
			console.warn(
				`⚠️  Your IP will be banned if nbrOfRequestPerSecond > ${NUMBER_REQUESTS_SECOND}`
			)
		}

		this.nbrOfRequestPerSecond =
			config?.nbrOfRequestPerSecond || NUMBER_REQUESTS_SECOND

		this.run()
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
		await this.waitToExecute(id, immediately)

		const url = `${BASE_URL}/term/${ontologyId.trim()}`
		const data = await this.get<HpoTermDetails>(url)

		this.removeFromStack(id)

		return data
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
		await this.waitToExecute(id, immediately)

		// intersecting?q=HP%3A0000365%2CHP%3A0006385
		const concat = ontologyIdIds.join(',')

		const url = `${BASE_URL}/term/intersecting?q=${concat}`
		const data = await this.get<IntersectingDiseaseAssociations>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Get gene associations for a specific term
	 * https://hpo.jax.org/api/hpo/term/HP%3A0001166/genes?max=-1
	 *
	 */
	public async getGeneAssociations(ontologyId: string, immediately = false) {
		if (!ontologyId) return null

		if (!checkHPOId(ontologyId)) {
			throw new Error(`Invalid id ${ontologyId}`)
		}

		// /term/HP%3A0001166/genes
		const url = `${BASE_URL}/term/${ontologyId}/genes?max=-1`

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<GeneAssociations>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Get disease associations for a specific term
	 * https://hpo.jax.org/api/hpo/term/HP%3A0001166/diseases?max=-1
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
		const url = `${BASE_URL}/term/${ontologyId}/diseases?max=-1`

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<DiseaseAssociations>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Search terms, diseases and genes
	 * https://hpo.jax.org/api/hpo/search/?q=arach&max=-1
	 */
	public async search(
		term: string,
		category?: 'terms' | 'genes' | 'diseases',
		immediately = false
	) {
		if (!term) return null

		// /search/?q=arach&max=-1
		let url = `${BASE_URL}/search/?q=${term}&max=-1`

		if (category) {
			url += `&category=${category}`
		}

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<Search>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Anchor Descendant Search Starting from the given hpo term id
	 * https://hpo.jax.org/api/hpo/search/?s=HP%3A0003674&q=juvenile
	 */
	public async searchDescendants(
		start: string,
		term: string,
		immediately = false
	) {
		if (!start || !term) return null

		if (!checkHPOId(start)) {
			throw new Error(`Invalid start id ${start}`)
		}

		// /search/descendants/?s=HP:0003674&q=juvenile
		const url = `${BASE_URL}/search/descendants/?s=${start}&q=${term}`

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<Descendant[]>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Get disease details ( term and gene associations ) by disease Id
	 * https://hpo.jax.org/api/hpo/disease/OMIM%3A154700
	 */
	public async getDisease(
		diseaseId: string,
		immediately = false
	) {
		if (!diseaseId) return null

		if (!checkOMIMId(diseaseId)) {
			throw new Error(`Invalid diseaseId ${diseaseId}`)
		}

		// /disease/OMIM%3A154700
		const url = `${BASE_URL}/disease/${diseaseId}`

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<Disease>(url)

		this.removeFromStack(id)

		return data
	}

	/**
	 * Get gene details ( disease and term associations ) by entrez Id
	 * https://hpo.jax.org/api/hpo/gene/2200
	 */
	public async getGene(
		entrezId: string,
		immediately = false
	) {
		if (!entrezId) return null

		if (!checkEntrezId(entrezId)) {
			throw new Error(`Invalid entrezId ${entrezId}`)
		}

		// /gene/2200
		const url = `${BASE_URL}/gene/${entrezId}`

		const id = uid()
		await this.waitToExecute(id, immediately)

		const data = await this.get<Gene>(url)

		this.removeFromStack(id)

		return data
	}

	private run() {
		setTimeout(() => {
			this.toExecId = this.stack.length ? this.stack[0] : ''
			this.run()
		}, 1000 / this.nbrOfRequestPerSecond)
	}

	private waitToExecute(id: string, immediately: boolean = false) {
		return new Promise(resolve => {
			if (immediately) {
				resolve(true)
			} else {
				if (!this.stack.includes(id)) {
					this.stack.push(id)
				}

				const refreshId = setInterval(() => {
					if (this.toExecId === id) {
						clearInterval(refreshId)
						resolve(true)
					}
				}, 30)
			}
		})
	}

	private removeFromStack(id: string) {
		const index = this.stack.indexOf(id)

		if (index !== -1) {
			this.stack.splice(index, 1)
		}
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
