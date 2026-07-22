import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// sha256 of the raw uploaded file bytes, used to short-circuit re-uploads of
// byte-identical data. last_checked_at is bumped on such a no-op check
// without touching updated_at.
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "content_hash" text`
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "last_checked_at" timestamp`

// 'active' | 'pending_review' — held out of the query path when an automated
// upload-time anomaly check (large row-count drop vs. the previous version)
// flags a revision for human review.
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "review_status" text NOT NULL DEFAULT 'active'`
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "anomaly_details" jsonb`

console.log(
    '✓ content_hash, last_checked_at, review_status, anomaly_details columns added to documents',
)
