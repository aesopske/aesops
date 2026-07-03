import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Derived Parquet artifact key (query/version substrate). Null until generated.
await sql`ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "parquet_key" text`
console.log('✓ parquet_key column added to documents')
