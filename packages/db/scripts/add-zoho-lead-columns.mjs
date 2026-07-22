import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Zoho Bigin sync tracking for leads. Mirrors the new columns in src/schema/leads.ts.
await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "zoho_contact_id" text`
await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "zoho_deal_id" text`
await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "zoho_synced_at" timestamp`
await sql`ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "zoho_sync_error" text`

console.log('✓ leads.zoho_* columns ready')
