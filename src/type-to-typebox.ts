import { Node, Type, TypeFlags } from 'ts-morph'

const typeboxBuilder = (method: string, argument_?: string) => `Type.${method}(${argument_ ?? ''})`

export const typeToTypebox = (type: Type, locationNode: Node): string => {
	if (type.isBoolean()) {
		return typeboxBuilder('Boolean')
	}
	if (type.isBooleanLiteral()) {
		return typeboxBuilder('Literal', type.getText())
	}

	if (type.isString()) {
		return typeboxBuilder('String')
	}
	if (type.isStringLiteral()) {
		return typeboxBuilder('Literal', type.getText())
	}

	if (type.isNumber()) {
		return typeboxBuilder('Number')
	}
	if (type.isNumberLiteral()) {
		return typeboxBuilder('Literal', type.getText())
	}

	const flags = type.getFlags()
	if (flags === TypeFlags.BigInt) {
		throw new Error('BigInt is not supported by Typebox')
	}
	if (flags === TypeFlags.BigIntLiteral) {
		throw new Error('BigInt is not supported by Typebox')
	}

	if (type.isAny()) {
		return typeboxBuilder('Any')
	}

	if (type.isNull()) {
		return typeboxBuilder('Null')
	}

	if (type.isUndefined()) {
		return typeboxBuilder('Undefined')
	}

	const symbol = type.getSymbol()
	if (symbol) {
		const symbolName = symbol.getName()
		if (symbolName === 'Date') return typeboxBuilder('Date')
	}

	if (type.isUnion()) {
		const union = type.getUnionTypes().map((innerType) => typeToTypebox(innerType, locationNode)).join(', ')
		return typeboxBuilder('Union', `[${union}]`)
	}

	if (type.isIntersection()) {
		const intersection = type.getIntersectionTypes().map((innerType) => typeToTypebox(innerType, locationNode)).join(
			', ',
		)
		return typeboxBuilder('Intersect', `[${intersection}]`)
	}

	if (type.isTuple()) {
		const tuple = type.getTupleElements().map((innerType) => typeToTypebox(innerType, locationNode)).join(', ')
		return typeboxBuilder('Tuple', `[${tuple}]`)
	}

	if (type.isArray()) {
		const elementType = type.getArrayElementTypeOrThrow()

		return typeboxBuilder('Array', typeToTypebox(elementType, locationNode))
	}

	if (type.isObject()) {
		const properties = type.getProperties()

		const propertySchemas = properties.map((property) => {
			const propertyType = property.getTypeAtLocation(locationNode)

			const schema = typeToTypebox(propertyType, locationNode)
			return `${property.getName()}: ${schema}`
		}).join(', ')

		return typeboxBuilder('Object', `{ ${propertySchemas} }`)
	}

	// fallback to unknown
	return typeboxBuilder('Unknown')
}

export const formatTypeboxValidator = (options: { functionName: string; typeboxSchema: string }) => {
	const { functionName, typeboxSchema } = options

	return `import { Boxed } from 'trpc-snapshot/typebox'
import { Type } from '@sinclair/typebox'

export const schema = ${typeboxSchema}
export const ${functionName} = Boxed(schema)
`
}
