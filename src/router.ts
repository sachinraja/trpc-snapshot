import { PrismaClient } from '@prisma/client'
import { initTRPC, TRPCError } from '@trpc/server'
import { fetch } from 'undici'
import { checkGetUser } from '../snapshots/getUser'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = fetch as any

const prisma = new PrismaClient()

const t = initTRPC.create()

// type User = {
// 	id: string
// 	name: string
// 	createdAt: Date
// }

const getUser = t.procedure.output(checkGetUser).query(async () => {
	const user = await prisma.user.findMany({
		where: {
			id: 1,
		},
	})

	if (!user) {
		throw new TRPCError({
			code: 'NOT_FOUND',
		})
	}

	return user
})

export const appRouter = t.router({
	getUser,
})

export type AppRouter = typeof appRouter
