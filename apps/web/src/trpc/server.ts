import 'server-only'
import { createCallerFactory, createTRPCContext } from './init'
import { appRouter } from '@/server/routers'
import { cache } from 'react'
import { headers } from 'next/headers'

const createContext = cache(async () => {
    return createTRPCContext({ headers: await headers() })
})

const createCaller = createCallerFactory(appRouter)

export const api = createCaller(createContext)
