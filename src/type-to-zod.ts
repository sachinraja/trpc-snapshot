import { Node, Type } from 'ts-morph'

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

	if (type.getSymbol()?.getName() === 'Date') {
		return zodBuilder('date')
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

		const objectified = properties.map((property) => {
			const propertyType = property.getTypeAtLocation(locationNode)

			const zodType = typeToZod(propertyType, locationNode)
			return `${property.getName()}: ${zodType}`
		}).join(', ')

		return zodBuilder('object', `{ ${objectified} }`)
	}

	// fallback to unknown
	return zodBuilder('unknown')
}
