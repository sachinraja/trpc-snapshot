import { capitalize } from './utils.js'

const prelude = `import { bigint } from 'trpc-snapshot/validators'`

export const formatValidator = (validator: string) =>
	`${prelude}\n\nexport const validate = (value) => {
	const result = ${validator}

	if (result.tag === 'failure') {
		throw new Error(result.failure.errors)
	}

	return result.success
}`

export const formatTypedValidator = (options: { procedurePath: string; zodSchema: string }) => {
	const { procedurePath, zodSchema } = options

	const functionName = `check${capitalize(procedurePath)}`
	return [
		"import { validate } from './validator.js'",
		"import { z } from 'zod'\n",
		`export const ${functionName} = <TSchema extends z.ZodSchema>(schema: TSchema) => validate as (value: unknown) => z.infer<TSchema>`,
		`const check = ${functionName}(${zodSchema})`,
	].join('\n')
}
