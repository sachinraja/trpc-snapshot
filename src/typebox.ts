import { TSchema } from '@sinclair/typebox'
import { TypeCompiler, ValueError } from '@sinclair/typebox/compiler'

export class TypeCheckError extends Error {
	public errors: ValueError[]
	constructor(errors: IterableIterator<ValueError>) {
		super('Invalid value')
		this.errors = [...errors]
	}
}

export const Boxed = <T extends TSchema>(schema: T) => {
	const check = TypeCompiler.Compile(schema)
	return (value: unknown) => {
		if (check.Check(value)) return value
		throw new TypeCheckError(check.Errors(value))
	}
}
