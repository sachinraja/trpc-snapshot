import { Boxed } from 'trpc-snapshot/typebox'
import { Type } from '@sinclair/typebox'

export const schema = Type.Array(Type.Object({ id: Type.Number(), createdAt: Type.Date(), email: Type.String(), name: Type.Union([Type.Null(), Type.String()]), role: Type.Union([Type.Literal("USER"), Type.Literal("ADMIN")]) }))
export const checkGetUser = Boxed(schema)
