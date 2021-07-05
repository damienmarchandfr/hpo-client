export interface HpoTermDetails {
	details: {
		name: string
		id: string
		altTermIds: string[]
		definition: string
		comment: string
		synonyms: string[]
		isObsolete: boolean
		xrefs: string[]
		pubmedXrefs: string[]
	}
	relations: {
		termCount: number
		parents: {
			name: string
			id: number
			childrenCount: number
			ontologyId: string
		}[]
		children: {
			name: string
			id: number
			childrenCount: number
			ontologyId: string
		}[]
	}
}

export interface IntersectingDiseaseAssociations {
	associations: {
		diseaseId: string
		diseaseName: string
		dbId: number
		db: 'OMIM' | 'ORPHA'
	}[]
}

export interface GeneAssociations {
	genes: {
		entrezGeneId: number
		entrezGeneSymbol: string
		dbDiseases: {
			id: number
			diseaseId: string
			diseaseName: string
			dbId: number
			db: 'OMIM' | 'ORPHA'
		}[]
	}[]

	geneCount: number
	offset: 1
	max: -1
}

export interface DiseaseAssociations {
	diseases: {
		diseaseId: string
		dbGenes: {
			id: number
			entrezGeneId: number
			entrezGeneSymbol: string
		}[]

		diseaseName: string
		dbId: number
		db: 'ORPHA' | 'OMIM'
	}[]

	diseaseCount: number
	offset: 1
	max: -1
}

export interface SearchResult {
	terms: {
		name: string
		id: string
		childrenCount: number
		ontologyId: string
		synonym: null | string
	}[]
	termsTotalCount: number | number
	termsOffset: 0

	diseases: []
	diseasesTotalCount: null | number
	diseasesOffset: null
	
	genes: []
	genesTotalCount: null | number
	genesOffset: null | number
}
