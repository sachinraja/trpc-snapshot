import { Project, SyntaxKind, TypeAliasDeclaration } from 'ts-morph'
import { typeToZod } from './type-to-zod.js'

export const getProcedureDefinitions = () => {
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

	const procedures = exportDeclaration
		.getType()
		.getPropertyOrThrow('queries')
		.getTypeAtLocation(appRouterDeclaration)
		// get all query procedures
		.getProperties()

	const procedureDefinitions = procedures.map((procedure) => {
		const procedureType = procedure
			.getTypeAtLocation(appRouterDeclaration)
			// get function type
			.getCallSignatures()[0]
			// get return type of function
			.getReturnType()
			// unwrap Promise<Type>
			.getTypeArguments()[0]

		return {
			name: procedure.getName(),
			zod: typeToZod(procedureType, appRouterDeclaration),
		}
	})

	return procedureDefinitions
}
