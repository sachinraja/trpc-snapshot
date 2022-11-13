export const validate = (value) => {
	if (!((Array.isArray(value) && value.every(value => ((typeof value === 'object' && value !== null && !Array.isArray(value)) && (typeof value.id === 'number') && (value.createdAt instanceof Date) && (typeof value.email === 'string') && (((value.name === null)) || ((typeof value.name === 'string'))) && (((value.role === 'USER')) || ((value.role === 'ADMIN')))))))) {
		throw new Error("Output did not match")
	}

	return value
}