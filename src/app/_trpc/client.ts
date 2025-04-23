import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@src/server'

export const api = createTRPCReact<AppRouter>({})
