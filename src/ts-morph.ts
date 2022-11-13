import { Project, SyntaxKind, Type, TypeAliasDeclaration } from 'ts-morph'
import { typeToTypebox } from './type-to-typebox.js'
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

	const procedures = exportDeclaration.getType().getProperties().filter((p) =>
		!['_def', 'createCaller', 'getErrorShape'].includes(p.getName())
	)

	const procedureDefinitions = procedures.map((procedure) => {
		const procedureType = procedure.getTypeAtLocation(appRouterDeclaration)
		const outputType = procedureType
			.getProperty('_def')
			?.getTypeAtLocation(appRouterDeclaration)
			.getProperty('_output_out')
			?.getTypeAtLocation(appRouterDeclaration) as Type

		return {
			name: procedure.getName(),
			zod: typeToZod(outputType, appRouterDeclaration),
			typebox: typeToTypebox(outputType, appRouterDeclaration),
		}
	})

	return procedureDefinitions
}
