import { validate } from './validator.js'
import { z } from 'zod'

export const checkGetUser = <TSchema extends z.ZodSchema>(schema: TSchema) => validate as (value: unknown) => z.infer<TSchema>
const check = checkGetUser(z.intersection(z.object({ id: z.number(), createdAt: z.date(), email: z.string(), name: z.union([z.null(), z.string()]), role: z.union([z.literal("USER"), z.literal("ADMIN")]) }), z.object({ posts: z.array(z.object({ id: z.number(), createdAt: z.date(), updatedAt: z.date(), published: z.boolean(), title: z.string(), authorId: z.union([z.null(), z.number()]) })), _count: z.object({ posts: z.number() }) })))