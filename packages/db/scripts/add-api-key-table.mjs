import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Better Auth `apiKey` plugin (@better-auth/api-key) storage table. Config-based
// model: `config_id` groups keys by configuration, `reference_id` is the owner
// id (a user id in our single-config setup), `key` is the hashed secret, and
// `permissions`/`metadata` are JSON serialised to text by the plugin.
// Mirrors the `apikeys` Drizzle table in src/schema/auth.ts.
await sql`
    CREATE TABLE IF NOT EXISTS "apikeys" (
        "id" text PRIMARY KEY,
        "config_id" text NOT NULL,
        "name" text,
        "start" text,
        "reference_id" text NOT NULL,
        "prefix" text,
        "key" text NOT NULL,
        "refill_interval" integer,
        "refill_amount" integer,
        "last_refill_at" timestamp,
        "enabled" boolean DEFAULT true,
        "rate_limit_enabled" boolean DEFAULT true,
        "rate_limit_time_window" integer,
        "rate_limit_max" integer,
        "request_count" integer DEFAULT 0,
        "remaining" integer,
        "last_request" timestamp,
        "expires_at" timestamp,
        "created_at" timestamp NOT NULL,
        "updated_at" timestamp NOT NULL,
        "permissions" text,
        "metadata" text
    )
`
await sql`CREATE INDEX IF NOT EXISTS "apikeys_reference_id_idx" ON "apikeys" ("reference_id")`

console.log('✓ apikeys table ready')
