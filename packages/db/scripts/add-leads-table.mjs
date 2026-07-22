import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Consultation-request and contact-us form submissions.
// Mirrors the `leads` Drizzle table in src/schema/leads.ts.
await sql`
    CREATE TABLE IF NOT EXISTS "leads" (
        "id" text PRIMARY KEY,
        "source" text NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "company" text,
        "phone" text,
        "service_interest" text,
        "message" text NOT NULL,
        "status" text NOT NULL DEFAULT 'new',
        "email_notified" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now()
    )
`

await sql`CREATE INDEX IF NOT EXISTS "idx_leads_source" ON "leads" ("source")`
await sql`CREATE INDEX IF NOT EXISTS "idx_leads_created_at" ON "leads" ("created_at")`

console.log('✓ leads table ready')
