import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)
await sql`TRUNCATE TABLE "comments" CASCADE`
console.log('✓ comments table truncated')
