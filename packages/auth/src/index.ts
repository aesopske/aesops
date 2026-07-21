import 'server-only'
import { betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP, twoFactor } from 'better-auth/plugins'
import { apiKey } from '@better-auth/api-key'
import { authEnv } from '@repo/env/auth'
import { db, eq, desc } from '@repo/db'
import * as schema from '@repo/db/schema'
import { sendSignInCode, sendTwoFactorCode } from './email'

const TWO_FACTOR_VERIFY_PATHS = new Set([
    '/two-factor/verify-totp',
    '/two-factor/verify-otp',
    '/two-factor/verify-backup-code',
])

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
        usePlural: true,
    }),
    plugins: [
        // API keys for programmatic, non-session access (scraper uploads today,
        // a read-oriented data API later). Keys are scoped by `permissions`
        // (e.g. { datasets: ['write'] }) and verified per request.
        apiKey({
            enableMetadata: true,
            defaultPrefix: 'Aes_',
            permissions: {
                defaultPermissions: { datasets: ['write'] },
            },
            // Default is 10 requests/day, far too low for scraper keys used to
            // batch-upload dozens of datasets during local development.
            rateLimit: {
                maxRequests: 1000,
            },
        }),
        // Primary sign-in factor: no password. A code is emailed on every
        // sign-in attempt; verifying it creates the user on first use, so
        // there's no separate sign-up step.
        emailOTP({
            otpLength: 6,
            expiresIn: 300,
            allowedAttempts: 5,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === 'sign-in') {
                    await sendSignInCode(email, otp)
                }
            },
        }),
        // Optional second factor, set up during onboarding. TOTP (an
        // authenticator app) is the real second factor; the OTP sub-option is
        // offered as a lower-friction fallback for users without one.
        // `allowPasswordless` must be top-level — that's what the
        // enable/disable endpoints check to skip the password requirement,
        // since we never have one to confirm with.
        twoFactor({
            issuer: 'Aesops',
            allowPasswordless: true,
            otpOptions: {
                async sendOTP({ user, otp }) {
                    // `UserWithTwoFactor`'s generic `User` base loses the
                    // concrete field types in this position; email is always
                    // present on the underlying row.
                    await sendTwoFactorCode((user as unknown as { email: string }).email, otp)
                },
            },
        }),
    ],
    socialProviders: {
        github: {
            clientId: authEnv.GITHUB_CLIENT_ID,
            clientSecret: authEnv.GITHUB_CLIENT_SECRET,
        },
        google: {
            clientId: authEnv.GOOGLE_CLIENT_ID,
            clientSecret: authEnv.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            username: {
                type: 'string',
                required: false,
                unique: true,
                input: true,
            },
            bio: {
                type: 'string',
                required: false,
                input: true,
            },
            website: {
                type: 'string',
                required: false,
                input: true,
            },
        },
    },
    session: {
        additionalFields: {
            // See the column comment on `sessions.twoFactorVerified` in
            // packages/db — this is our own gate, not Better Auth's.
            twoFactorVerified: {
                type: 'boolean',
                required: false,
                input: false,
            },
        },
    },
    databaseHooks: {
        session: {
            create: {
                // Same generic-inference gap as the `sendOTP` user param
                // above — `session`/`ctx` resolve to `any` here regardless of
                // context, so we annotate explicitly instead of leaving an
                // implicit any.
                before: async (session: { userId: string }) => {
                    const [user] = await db
                        .select({ twoFactorEnabled: schema.users.twoFactorEnabled })
                        .from(schema.users)
                        .where(eq(schema.users.id, session.userId))
                    return { data: { ...session, twoFactorVerified: !user?.twoFactorEnabled } }
                },
            },
        },
    },
    hooks: {
        // The `twoFactor` plugin's own sign-in interception only matches
        // /sign-in/email, /sign-in/username and /sign-in/phone-number, so it
        // never fires for our email-OTP flow — a 2FA-enabled user otherwise
        // gets a fully valid session before the second factor is checked.
        // The `create.before` hook above stamps every new session as
        // unverified when 2FA is on; this flips it once the user actually
        // clears a second-factor challenge. The verify-* endpoints issue a
        // fresh session via `internalAdapter.createSession` directly (not
        // through a path that populates `ctx.context.newSession`), so we
        // can't read the new session id off the hook context — instead we
        // target the user's most-recently-created session, which is exactly
        // the one just created by this same request. Protected routes must
        // check `session.twoFactorVerified` themselves (see
        // src/lib/platform/session.ts in apps/web).
        after: createAuthMiddleware(async (ctx: Parameters<Parameters<typeof createAuthMiddleware>[0]>[0]) => {
            if (!TWO_FACTOR_VERIFY_PATHS.has(ctx.path)) return
            const userId = ctx.context.session?.user.id ?? ctx.context.newSession?.user.id
            if (!userId) return
            const [latest] = await db
                .select({ id: schema.sessions.id })
                .from(schema.sessions)
                .where(eq(schema.sessions.userId, userId))
                .orderBy(desc(schema.sessions.createdAt))
                .limit(1)
            if (!latest) return
            await db.update(schema.sessions).set({ twoFactorVerified: true }).where(eq(schema.sessions.id, latest.id))
        }),
    },
})

export type Auth = typeof auth
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
