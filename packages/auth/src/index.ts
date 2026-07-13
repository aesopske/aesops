import 'server-only'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { apiKey } from '@better-auth/api-key'
import { db } from '@repo/db'
import * as schema from '@repo/db/schema'

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
        }),
    ],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
})

export type Auth = typeof auth
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
