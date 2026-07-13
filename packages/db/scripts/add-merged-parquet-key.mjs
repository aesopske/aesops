import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Merged Parquet artifact across all versions of a dataset (root docs only).
// Null until the merge job has run at least once.
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "merged_parquet_key" text`
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "merged_parquet_updated_at" timestamp`
console.log('✓ merged_parquet_key and merged_parquet_updated_at columns added to documents')
