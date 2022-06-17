import { PrismaClient } from '@prisma/client'
import { initTRPC, TRPCError } from '@trpc/server'
import { fetch } from 'undici'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = fetch as any

const prisma = new PrismaClient()

const t = initTRPC()()

const getUser = t.procedure.resolve(async () => {
	const user = await prisma.user.findUnique({
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
	queries: {
		getUser,
	},
})

export type AppRouter = typeof appRouter
