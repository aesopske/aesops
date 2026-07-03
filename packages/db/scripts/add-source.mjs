import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "source" text`
console.log('✓ source column added to documents')
