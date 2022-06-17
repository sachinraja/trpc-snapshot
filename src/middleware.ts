import { MiddlewareFunction } from '@trpc/server/dist/internals/middlewares.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { formatTypedValidator, formatValidator } from './format.js'
import { specToValidator } from './spectypes-to-validator.js'
import { valueToSpec } from './value-to-spectypes.js'
import { valueToZod } from './value-to-zod.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const snapshotMiddleware: MiddlewareFunction<any, any, any> = async ({ next, path: procedurePath }) => {
	const result = await next()

	if (result.ok) {
		const validator = await specToValidator(valueToSpec(result.data))
		const zodSchema = valueToZod(result.data)

		const snapshotProcedurePath = path.join('snapshots', procedurePath)
		const validatorPath = path.join(snapshotProcedurePath, 'validator.js')
		const typedValidatorPath = path.join(snapshotProcedurePath, 'index.ts')

		await fs.mkdir(snapshotProcedurePath, { recursive: true })

		await Promise.all([
			fs.writeFile(validatorPath, formatValidator(validator), 'utf8'),
			fs.writeFile(typedValidatorPath, formatTypedValidator({ procedurePath, zodSchema }), 'utf8'),
		])

		console.log(procedurePath, result.data)
	}

	return result
}
