import { createTRPCClient } from '@trpc/client'
import superjson from 'superjson'
import { AppRouter } from './router.js'

export const client = createTRPCClient<AppRouter>({
	url: 'http://localhost:3000',
	transformer: superjson,
})
