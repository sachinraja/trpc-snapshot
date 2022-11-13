import { TypeCompiler } from '@sinclair/typebox/compiler'
import fs from 'node:fs/promises'
import path from 'node:path'
import { formatTypedValidator, formatValidator } from './format.js'
import { getProcedureDefinitions } from './ts-morph.js'
export const buildSnapshots = async () => {
	const procedureDefinitions = getProcedureDefinitions()

	await Promise.all(procedureDefinitions.map(async (procedureDefinition) => {
		const snapshotProcedurePath = path.join('snapshots', procedureDefinition.name)
		const validatorPath = path.join(snapshotProcedurePath, 'validator.js')
		const typedValidatorPath = path.join(snapshotProcedurePath, 'index.ts')

		await fs.mkdir(snapshotProcedurePath, { recursive: true })

		await Promise.all([
			fs.writeFile(validatorPath, formatValidator(TypeCompiler.Compile(procedureDefinition.typebox).Code()), 'utf8'),
			fs.writeFile(
				typedValidatorPath,
				formatTypedValidator({ procedurePath: procedureDefinition.name, zodSchema: procedureDefinition.zod }),
				'utf8',
			),
		])
	}))
}

buildSnapshots()
