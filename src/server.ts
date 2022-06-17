import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './router.js'

const { listen } = createHTTPServer({ router: appRouter })

listen(3000)

console.log('Listening at http://localhost:3000')
