import { Node, Type, TypeFlags } from 'ts-morph'

const zodBuilder = (method: string, argument_?: string) => `z.${method}(${argument_ ?? ''})`

export const typeToZod = (type: Type, locationNode: Node): string => {
	if (type.isBoolean()) {
		return zodBuilder('boolean')
	}
	if (type.isBooleanLiteral()) {
		return zodBuilder('literal', type.getText())
	}

	if (type.isString()) {
		return zodBuilder('string')
	}
	if (type.isStringLiteral()) {
		return zodBuilder('literal', type.getText())
	}

	if (type.isNumber()) {
		return zodBuilder('number')
	}
	if (type.isNumberLiteral()) {
		return zodBuilder('literal', type.getText())
	}

	const flags = type.getFlags()
	if (flags === TypeFlags.BigInt) {
		return zodBuilder('bigint')
	}
	if (flags === TypeFlags.BigIntLiteral) {
		return zodBuilder('literal', type.getText())
	}

	if (type.isAny()) {
		return zodBuilder('any')
	}

	if (type.isNull()) {
		return zodBuilder('null')
	}

	if (type.isUndefined()) {
		return zodBuilder('undefined')
	}

	const symbol = type.getSymbol()
	if (symbol) {
		const symbolName = symbol.getName()
		if (symbolName === 'Date') return zodBuilder('date')
	}

	if (type.isUnion()) {
		const zodUnion = type.getUnionTypes().map((innerType) => typeToZod(innerType, locationNode)).join(', ')
		return zodBuilder('union', `[${zodUnion}]`)
	}

	if (type.isIntersection()) {
		const zodIntersection = type.getIntersectionTypes().map((innerType) => typeToZod(innerType, locationNode)).join(
			', ',
		)
		return zodBuilder('intersection', zodIntersection)
	}

	if (type.isTuple()) {
		const zodTuple = type.getTupleElements().map((innerType) => typeToZod(innerType, locationNode)).join(', ')
		return zodBuilder('tuple', `[${zodTuple}]`)
	}

	if (type.isArray()) {
		const elementType = type.getArrayElementTypeOrThrow()

		return zodBuilder('array', typeToZod(elementType, locationNode))
	}

	if (type.isObject()) {
		const properties = type.getProperties()

		const propertySchemas = properties.map((property) => {
			const propertyType = property.getTypeAtLocation(locationNode)

			const zodType = typeToZod(propertyType, locationNode)
			return `${property.getName()}: ${zodType}`
		}).join(', ')

		return zodBuilder('object', `{ ${propertySchemas} }`)
	}

	// fallback to unknown
	return zodBuilder('unknown')
}
