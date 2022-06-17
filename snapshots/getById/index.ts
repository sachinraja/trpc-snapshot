import { validate } from './validator.js'
import { z } from 'zod'

export const checkGetById = <TSchema extends z.ZodSchema>(schema: TSchema) => validate as (value: unknown) => z.infer<TSchema>
const check = checkGetById(z.array(z.string()))