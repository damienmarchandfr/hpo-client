import { readFile, writeFile } from 'fs'
import { promisify } from 'util'

const readFileP = promisify(readFile)
const writeFileP = promisify(writeFile)

const hpoList: string[] = []

readFileP(__dirname + '/../../files/phenotype_to_genes.txt')
	.then(async (buffer) => {
		const content = buffer.toString()
		const rows = content.split('\n')
		for (let i = 1; i < rows.length; i++) {
			const row = rows[i]
			const hpo = row.split('\t')[0].trim()
			if (hpo && !hpoList.includes(hpo)) {
				hpoList.push(hpo)
			}
		}
		await writeFileP(__dirname + '/../data/hpo.json', JSON.stringify(hpoList))
		console.log('Script finished')
	})
	.catch((err) => {
		console.error(err)
	})
