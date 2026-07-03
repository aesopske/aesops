import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`CREATE INDEX IF NOT EXISTS "idx_chat_messages_dataset_role" ON "chat_messages" ("dataset_id", "role")`
console.log('✓ index on chat_messages(dataset_id, role) created')
