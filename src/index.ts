import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveConfig, TrpcSnapshotConfig } from './config.js'
import { getProcedureDefinitions } from './ts-morph.js'
import { formatTypeboxValidator, typeToTypebox } from './type-to-typebox.js'
import { capitalize } from './utils.js'

export const buildSnapshots = async () => {
	const config = await resolveConfig()
	console.log(config)
	const { definitions, routerLocationNode } = getProcedureDefinitions(config)

	await Promise.all(definitions.map(async (definition) => {
		const validatorPath = path.join('snapshots', `${definition.name}.ts`)

		const functionName = `check${capitalize(definition.name)}`

		await Promise.all([
			fs.writeFile(
				validatorPath,
				formatTypeboxValidator({
					functionName,
					typeboxSchema: typeToTypebox(definition.outputType, routerLocationNode),
				}),
				'utf8',
			),
		])
	}))
}

export const defineConfig = (config: Partial<TrpcSnapshotConfig>) => config
