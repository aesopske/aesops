import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "category" text`
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "tags" jsonb`
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "classified_at" timestamp`
console.log('✓ category, tags, classified_at columns added to documents')
