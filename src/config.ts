import { bundleRequire } from 'bundle-require'

export type TrpcSnapshotConfig = {
	/**
	 * @default tsconfig.json
	 */
	tsconfigPath: string

	/**
	 * @default snapshots
	 */
	snapshotsDir: string

	/**
	 * @description
	 * If true, will not generate snapshots
	 * but instead just check if they are up to date
	 * and exit with code 1 if they are not
	 *
	 * Useful for CI
	 */
	checkOnly: boolean
}

const defaultConfig: TrpcSnapshotConfig = {
	tsconfigPath: 'tsconfig.json',
	snapshotsDir: 'snapshots',
	checkOnly: false,
}

export async function resolveConfig(configFile = 'trpc.config.ts') {
	const { mod } = await bundleRequire({
		filepath: configFile,
	})

	const userConfig: Partial<TrpcSnapshotConfig> = mod.default

	return {
		...defaultConfig,
		...userConfig,
	}
}
