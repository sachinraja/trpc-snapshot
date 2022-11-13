import { capitalize } from './utils.js'

export const formatValidator = (validator: string) => {
	const validatorBody = validator.slice(47).slice(0, -5)
	return `export const validate = (value) => {
	if (!(${validatorBody})) {
		throw new Error("Output did not match")
	}

	return value
}`
}

export const formatTypedValidator = (options: { procedurePath: string; zodSchema: string }) => {
	const { procedurePath, zodSchema } = options

	const functionName = `check${capitalize(procedurePath)}`
	return [
		"import { validate } from './validator.js'",
		"import { z } from 'zod'\n",
		`const schema = ${zodSchema}`,
		`export const ${functionName} = validate as (value: unknown) => z.infer<typeof schema>`,
	].join('\n')
}
