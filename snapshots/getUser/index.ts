import { z } from 'zod'
import { validate } from './validator.js'

export const checkGetUser = <TSchema extends z.ZodSchema>(schema: TSchema) =>
	validate as (value: unknown) => z.infer<TSchema>
const check = checkGetUser(
	z.object({
		id: z.number(),
		createdAt: z.date(),
		email: z.string(),
		name: z.union([z.null(), z.string()]),
		role: z.union([z.literal('USER'), z.literal('ADMIN')]),
	}),
)
