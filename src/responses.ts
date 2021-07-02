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
		diseaseId: string // OMIM
		diseaseName: string
		dbId: number
		db: 'OMIM'
	}[]
}
