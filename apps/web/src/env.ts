import { createEnv } from '@t3-oss/env-nextjs'
import { sanityEnv } from '@repo/env/sanity'
import { observabilityEnv } from '@repo/env/observability'
import { authEnv, storageEnv } from '@repo/env'
import { z } from 'zod'

export const env = createEnv({
    extends: [sanityEnv, authEnv, storageEnv, observabilityEnv],
    server: {
        GEMINI_API_KEY: z.string().optional(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
        SANITY_API_TOKEN: z.string({
            message: 'SANITY_API_TOKEN is required',
        }),
        // Shared secret used to verify the signature on Sanity's revalidation
        // webhook (POST /api/revalidate). Optional so builds/dev without a
        // configured webhook still boot.
        SANITY_REVALIDATE_SECRET: z.string().optional(),
        // Remote DuckDB query executor (native DuckDB on Python/Vercel) — see
        // apps/duckdb-executor. Replaces the in-process @duckdb/duckdb-wasm
        // instance, which couldn't reliably autoload extensions in this
        // Lambda sandbox.
        DUCKDB_EXECUTOR_URL: z.string({
            message: 'DUCKDB_EXECUTOR_URL is required',
        }),
        DUCKDB_EXECUTOR_SECRET: z.string({
            message: 'DUCKDB_EXECUTOR_SECRET is required',
        }),
        // Comma-separated allowlist of emails granted access to /admin.
        ADMIN_EMAILS: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_DEMO_CREDENTIALS: z.string().optional(),
        NEXT_PUBLIC_AESOPS_API_URL: z.string().optional(),
        NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_AESOPS_API_URL: process.env.NEXT_PUBLIC_AESOPS_API_URL,
        NEXT_PUBLIC_DEMO_CREDENTIALS: process.env.NEXT_PUBLIC_DEMO_CREDENTIALS,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
        SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
        DUCKDB_EXECUTOR_URL: process.env.DUCKDB_EXECUTOR_URL,
        DUCKDB_EXECUTOR_SECRET: process.env.DUCKDB_EXECUTOR_SECRET,
        ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    },
})
