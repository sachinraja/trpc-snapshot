import { bigint } from 'trpc-snapshot/validators'

export const validate = (value) => {
	const result = value => {
  let err;

  if (!Array.isArray(value)) {
    (err = err || []).push({
      issue: 'not an array',
      path: []
    });
  } else {
    for (let index = 0; index < value.length; index++) {
      const value_index = value[index];

      if (typeof value_index !== 'string') {
        (err = err || []).push({
          issue: 'not a string',
          path: [index]
        });
      }
    }
  }

  return err ? {
    tag: 'failure',
    failure: {
      value,
      errors: err
    }
  } : {
    tag: 'success',
    success: value
  };
};

	if (result.tag === 'failure') {
		throw new Error(result.failure.errors)
	}

	return result.success
}