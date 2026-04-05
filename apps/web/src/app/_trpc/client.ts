import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@apps/web/src/server'

export const api = createTRPCReact<AppRouter>({})
