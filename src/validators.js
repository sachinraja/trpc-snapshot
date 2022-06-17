const _limit = x => typeof x === 'bigint'

export const bigint = value => {
	let err

	if (!_limit(value)) {
		;(err = err || []).push({
			issue: 'does not fit the limit',
			path: [],
		})
	}

	return err
		? {
			tag: 'failure',
			failure: {
				value,
				errors: err,
			},
		}
		: {
			tag: 'success',
			success: value,
		}
}
