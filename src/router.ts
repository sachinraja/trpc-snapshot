// import superjson from 'superjson'
import { fetch } from 'undici'
// import { z } from 'zod'
// import { createTRPCClient } from '../../../contributing/trpc-v10/packages/client'
// import { createHTTPServer } from '../../../contributing/trpc-v10/packages/server/adapters/standalone'
import { PrismaClient, User } from '@prisma/client'
import { initTRPC, TRPCError } from '../../../contributing/trpc-v10/packages/server/src'

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

const appRouter = t.router({
	queries: {
		getUser,
	},
})

export type AppRouter = typeof appRouter
