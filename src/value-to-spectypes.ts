export const valueToSpec = (object: unknown): string => {
	switch (typeof object) {
		case 'bigint': {
			return 'validator(bigint)'
		}
		case 'boolean': {
			return 'boolean'
		}
		case 'number': {
			return 'number'
		}
		case 'string': {
			return 'string'
		}
		case 'undefined': {
			return 'literal(undefined)'
		}
		case 'object': {
			if (object === null) return 'literal(null)'

			if (Array.isArray(object)) {
				const schemas = new Set<string>()
				for (const property of object) {
					schemas.add(valueToSpec(property))
				}

				if (schemas.size === 1) {
					return `array(${schemas.values().next().value})`
				}

				const schemaUnion = [...schemas.values()].join(', ')
				return `array(union(${schemaUnion}))`
			}

			const properties = Object.entries(object).map(([key, value]) => `${key}: ${valueToSpec(value)}`).join(',\n')
			return `object({ ${properties} })`
		}
		default: {
			return 'unknown'
		}
	}
}
