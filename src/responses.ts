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
		parents: Array<{
			name: string
			id: number
			childrenCount: number
			ontologyId: string
		}>
		children: Array<{
			name: string
			id: number
			childrenCount: number
			ontologyId: string
		}>
	}
}

export interface IntersectingDiseaseAssociations {
	associations: Array<{
		diseaseId: string
		diseaseName: string
		dbId: number
		db: 'OMIM' | 'ORPHA'
	}>
}

export interface GeneAssociations {
	genes: Array<{
		entrezGeneId: number
		entrezGeneSymbol: string
		dbDiseases: Array<{
			id: number
			diseaseId: string
			diseaseName: string
			dbId: number
			db: 'OMIM' | 'ORPHA'
		}>
	}>

	geneCount: number
	offset: number
	max: number
}

export interface DiseaseAssociations {
	diseases: Array<{
		diseaseId: string
		dbGenes: Array<{
			id: number
			entrezGeneId: number
			entrezGeneSymbol: string
		}>

		diseaseName: string
		dbId: number
		db: 'ORPHA' | 'OMIM'
	}>

	diseaseCount: number
	offset: number
	max: number
}

export interface Search {
	terms: Array<{
		name: string
		id: string,
		childrenCount: number
		ontologyId: string
		synonym: string
	}>
	termsTotalCount: number
	termsOffset: number
	diseases: Array<{
		db: string
		dbName: string
		dbRef: string
		diseaseId: string
	}>
	diseasesTotalCount: number
	diseasesOffset: number
	genes: Array<{
		entrezGeneId: number
		entrezGeneSymbol: string
	}>
	genesTotalCount: number
	genesOffset: number
}

export interface Descendant {
	ontologyId: string
	name: string
}

export interface Disease {
	disease: {
		diseaseId: string
		diseaseName: string
		dbId: string
		db: string
	}
	geneAssoc: Array<{
		entrezGeneId: number
		entrezGeneSymbol: string
	}>
	catTermsMap: Array<{
		catLabel: string
		terms: Array<{
			ontologyId: string
			name: string
			definition: string
			frequency: string
			onset: string
			sources: string
		}>
	}>
}

export interface Gene {
	gene: {
		entrezGeneId: number,
		entrezGeneSymbol: string
	}
	termAssoc: Array<{
		ontologyId: string
		name: string
		definition: string
	}>
	diseaseAssoc: Array<{
		diseaseId: string
		diseaseName: string
		dbId: string
		db: string
	}>
}
