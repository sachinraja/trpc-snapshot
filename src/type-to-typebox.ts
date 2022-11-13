import { TAnySchema, TObject, Type as TBox } from '@sinclair/typebox'
import { Node, Type, TypeFlags } from 'ts-morph'

export const typeToTypebox = (type: Type, locationNode: Node): TAnySchema => {
	if (type.isBoolean()) {
		return TBox.Boolean()
	}
	if (type.isBooleanLiteral()) {
		return TBox.Literal(type.getLiteralValue() as unknown as boolean)
	}

	if (type.isString()) {
		return TBox.String()
	}
	if (type.isStringLiteral()) {
		return TBox.Literal(type.getLiteralValue() as unknown as string)
	}

	if (type.isNumber()) {
		return TBox.Number()
	}
	if (type.isNumberLiteral()) {
		return TBox.Literal(type.getLiteralValue() as unknown as number)
	}

	const flags = type.getFlags()
	if (flags === TypeFlags.BigInt) {
		throw new Error('BigInt is not supported by TypeBox')
	}
	if (flags === TypeFlags.BigIntLiteral) {
		return TBox.Literal(type.getText())
	}

	if (type.isAny()) {
		return TBox.Any()
	}

	if (type.isNull()) {
		return TBox.Null()
	}

	if (type.isUndefined()) {
		return TBox.Undefined()
	}

	const symbol = type.getSymbol()
	if (symbol) {
		const symbolName = symbol.getName()
		if (symbolName === 'Date') return TBox.Date()
	}

	if (type.isUnion()) {
		const union = type.getUnionTypes().map((innerType) => typeToTypebox(innerType, locationNode))
		return TBox.Union(union)
	}

	if (type.isIntersection()) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const intersection = type.getIntersectionTypes().map((innerType) =>
			typeToTypebox(innerType, locationNode)
		) as TObject[]

		return TBox.Intersect(intersection)
	}

	if (type.isTuple()) {
		const tuple = type.getTupleElements().map((innerType) => typeToTypebox(innerType, locationNode))
		return TBox.Tuple(tuple)
	}

	if (type.isArray()) {
		const elementType = type.getArrayElementTypeOrThrow()

		return TBox.Array(typeToTypebox(elementType, locationNode))
	}

	if (type.isObject()) {
		const properties = type.getProperties()

		const propertySchemas = Object.fromEntries(properties.map((property) => {
			const propertyType = property.getTypeAtLocation(locationNode)

			return [property.getName(), typeToTypebox(propertyType, locationNode)]
		}))

		return TBox.Object(propertySchemas)
	}

	// fallback to unknown
	return TBox.Unknown()
}
