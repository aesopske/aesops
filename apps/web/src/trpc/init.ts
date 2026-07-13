import 'server-only'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { auth } from '@repo/auth'
import { isAdminEmail } from '@/lib/platform/admin'

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await auth.api.getSession({ headers: opts.headers })
    return {
        ...opts,
        session,
    }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        }
    },
})

export const router = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({ ctx: { ...ctx, session: ctx.session } })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (!isAdminEmail(ctx.session.user.email)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next({ ctx })
})
