import { transformAsync } from '@babel/core'
import spectypes from 'babel-plugin-spectypes'

export const specToValidator = async (spec: string) => {
	// const additionalValidatorCode = await fs.readFile(path.join(__dirname, 'spectypes.js'), 'utf8')
	// const prelude = await transformAsync(additionalValidatorCode, {
	// 	plugins: [spectypes],
	// })

	// if (!prelude?.code) throw new Error('Failed to parse spectypes.js')

	// await fs.writeFile(path.join(__dirname, 'spectypes-compiled.js'), prelude.code, 'utf8')

	const sourceCode =
		`import { boolean, number, string, literal, array, union, object, unknown, validator } from "spectypes"\nconst check = ${spec}`

	const result = await transformAsync(sourceCode, {
		plugins: [spectypes],
	})

	if (!result?.code) throw new Error('Could not transform spec code')

	return result.code.slice(14)
}
