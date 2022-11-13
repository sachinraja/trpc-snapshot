import { validate } from './validator.js'
import { z } from 'zod'

const schema = z.array(z.object({ id: z.number(), createdAt: z.date(), email: z.string(), name: z.union([z.null(), z.string()]), role: z.union([z.literal("USER"), z.literal("ADMIN")]) }))
export const checkGetUser = validate as (value: unknown) => z.infer<typeof schema>