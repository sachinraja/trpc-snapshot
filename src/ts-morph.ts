import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Project, SyntaxKind, Type, TypeAliasDeclaration } from 'ts-morph'

const project = new Project({
	tsConfigFilePath: 'tsconfig.json',
})

const routerFile = project.getSourceFileOrThrow('router.ts')

let exportDeclaration: TypeAliasDeclaration | undefined

for (const [name, declarations] of routerFile.getExportedDeclarations()) {
	if (name === 'AppRouter') {
		exportDeclaration = declarations[0].asKindOrThrow(SyntaxKind.TypeAliasDeclaration)
	}
}

if (!exportDeclaration) throw new Error('Could not find export declaration for appRouter')

const appRouterDeclaration = exportDeclaration

const procedures = exportDeclaration.getType().getPropertyOrThrow('queries').getTypeAtLocation(appRouterDeclaration)
	.getProperties()

const zodBuilder = (method: string, argument_?: string) => `z.${method}(${argument_ ?? ''})`

const typeToZod = (type: Type): string => {
	if (type.isUnion()) {
		const zodUnion = type.getUnionTypes().map((innerType) => typeToZod(innerType)).join(', ')
		return zodBuilder('union', `[${zodUnion}]`)
	}

	if (type.isIntersection()) {
		const zodIntersection = type.getIntersectionTypes().map((innerType) => typeToZod(innerType)).join(', ')
		return zodBuilder('intersection', zodIntersection)
	}

	if (type.isBoolean()) {
		return zodBuilder('boolean')
	}

	if (type.isNumber()) {
		return zodBuilder('number')
	}

	if (type.isString()) {
		return zodBuilder('string')
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

	if (type.isBooleanLiteral()) {
		return zodBuilder('boolean', type.getText())
	}

	if (type.isLiteral()) {
		return zodBuilder('literal', type.getLiteralValueOrThrow().toString())
	}

	if (type.isArray()) {
		const elementType = type.getArrayElementTypeOrThrow()

		return zodBuilder('array', typeToZod(elementType))
	}

	if (type.isObject()) {
		const properties = type.getProperties()

		const objectified = properties.map((property) => {
			const propertyType = property.getTypeAtLocation(appRouterDeclaration)
			const zodType = typeToZod(propertyType)

			return `${property.getName()}: ${zodType}`
		}).join(', ')

		return zodBuilder('object', `{ ${objectified} }`)
	}

	return zodBuilder('unknown')
}

procedures.map((procedure) => {
	const procedureType =
		procedure.getTypeAtLocation(appRouterDeclaration).getCallSignatures()[0].getReturnType().getTypeArguments()[0]

	console.log(typeToZod(procedureType))
})
