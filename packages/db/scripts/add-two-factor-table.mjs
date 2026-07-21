import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Better Auth `twoFactor` plugin storage. One row per user who has enabled
// 2FA (TOTP secret + encrypted backup codes); `two_factor_enabled` on
// `users` tracks whether the plugin should challenge sign-in.
// Mirrors the `twoFactors` Drizzle table in src/schema/auth.ts.
await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "two_factor_enabled" boolean DEFAULT false`

await sql`
    CREATE TABLE IF NOT EXISTS "two_factors" (
        "id" text PRIMARY KEY,
        "secret" text NOT NULL,
        "backup_codes" text NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "verified" boolean DEFAULT true,
        "failed_verification_count" integer DEFAULT 0,
        "locked_until" timestamp
    )
`

console.log('✓ two_factors table ready')
