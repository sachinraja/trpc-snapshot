// import superjson from 'superjson'
import { fetch } from 'undici'
import { z } from 'zod'
// import { createTRPCClient } from '../../../contributing/trpc-v10/packages/client'
// import { router } from '../../../contributing/trpc-v10/packages/server'
// import { createHTTPServer } from '../../../contributing/trpc-v10/packages/server/adapters/standalone'
import { initTRPC } from '../../../contributing/trpc-v10/packages/server/dist/core'
// import { snapshotMiddleware } from './middleware.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.fetch = fetch as any

const t = initTRPC()()

type User = {
	id: string
	name: string
	age: 9
}

const user: User = {
	age: 9,
	id: '123',
	name: 'John Doe',
}

const foo = t.procedure.resolve(() => user)

const moreProcedures = { b: t.procedure.resolve(() => 9 as const) }
const r = t.router({
	queries: {
		foo,
		...moreProcedures,
	},
})

export const appRouter = r

// export const appRouter = router().middleware(snapshotMiddleware).query('getById', {
// 	input: z.object({
// 		num: z.string(),
// 	}),
// 	resolve({ input }) {
// 		return input
// 	},
// })

export type AppRouter = typeof appRouter

// const client = createTRPCClient<AppRouter>({
// 	url: 'http://localhost:3000',
// 	transformer: superjson,
// })

// const { server } = createHTTPServer({ router: appRouter })

// server.listen(3000, () => {
// 	console.log('Listening at http://localhost:3000')

// 	client.query('getById', { num: '1' })
// })
