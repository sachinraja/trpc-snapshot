import { limit, unknown } from 'spectypes'

export const bigint = limit(unknown, (x) => typeof x === 'bigint')
