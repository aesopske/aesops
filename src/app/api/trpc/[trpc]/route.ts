import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest } from 'next/server'
import { appRouter } from '@src/server'
import { createTRPCContext } from '@src/server/trpc'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    })
}

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        req,
        endpoint: '/api/trpc',
        router: appRouter,
        createContext: () => createContext(req),
        onError:
            process.env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      // eslint-disable-next-line no-console
                      console.error(
                          `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                              error.message
                          }`,
                      )
                  }
                : undefined,
    })

export { handler as GET, handler as POST }
