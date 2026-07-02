import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`
    CREATE TABLE IF NOT EXISTS "ai_usage_events" (
        "id"                 text PRIMARY KEY,
        "route"              text NOT NULL,
        "model"              text NOT NULL,
        "user_id"            text REFERENCES "users"("id") ON DELETE SET NULL,
        "prompt_tokens"      integer,
        "completion_tokens"  integer,
        "total_tokens"       integer,
        "latency_ms"         integer NOT NULL,
        "success"            boolean NOT NULL,
        "error_message"      text,
        "created_at"         timestamp NOT NULL DEFAULT now()
    )
`
console.log('✓ ai_usage_events table created')
