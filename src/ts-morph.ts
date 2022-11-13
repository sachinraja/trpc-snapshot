import { Project, SyntaxKind, Type, TypeAliasDeclaration } from 'ts-morph'
import { TrpcSnapshotConfig } from './config.js'

type ProcedureDefinition = {
	name: string
	outputType: Type
}

export const getProcedureDefinitions = (config: TrpcSnapshotConfig) => {
	const project = new Project({
		tsConfigFilePath: config.tsconfigPath,
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

	const definitions = procedures.map<ProcedureDefinition>((procedure) => {
		const procedureType = procedure.getTypeAtLocation(appRouterDeclaration)
		const outputType = procedureType
			.getProperty('_def')
			?.getTypeAtLocation(appRouterDeclaration)
			.getProperty('_output_out')
			?.getTypeAtLocation(appRouterDeclaration) as Type

		return {
			name: procedure.getName(),
			outputType,
		}
	})

	return { definitions, routerLocationNode: appRouterDeclaration }
}
