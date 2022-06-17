const zodBuilder = (method: string) => `z.${method}()`

export const valueToZod = (object: unknown): string => {
	switch (typeof object) {
		case 'bigint': {
			return zodBuilder('bigint')
		}
		case 'boolean': {
			return zodBuilder('boolean')
		}
		case 'number': {
			return zodBuilder('number')
		}
		case 'string': {
			return zodBuilder('string')
		}
		case 'undefined': {
			return zodBuilder('undefined')
		}
		case 'object': {
			if (object === null) return zodBuilder('null')

			if (Array.isArray(object)) {
				const schemas = new Set<string>()
				for (const property of object) {
					schemas.add(valueToZod(property))
				}

				if (schemas.size === 1) {
					return `z.array(${schemas.values().next().value})`
				}

				const schemaUnion = [...schemas.values()].join(', ')
				return `z.array(union(${schemaUnion}))`
			}

			const properties = Object.entries(object).map(([key, value]) => `${key}: ${valueToZod(value)}`).join(',\n')
			return `z.object({ ${properties} })`
		}
		default: {
			return zodBuilder('unknown')
		}
	}
}
