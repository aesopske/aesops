import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// See src/schema/auth.ts for why this exists — Better Auth's twoFactor
// plugin doesn't gate our email-OTP sign-in route, so we track "has this
// session actually cleared its second factor" ourselves.
await sql`ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "two_factor_verified" boolean DEFAULT true NOT NULL`

console.log('✓ sessions.two_factor_verified ready')
