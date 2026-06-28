import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Add voteScore column to comments
await sql`ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "vote_score" integer NOT NULL DEFAULT 0`
console.log('✓ vote_score column added to comments')

// Create comment_votes table
await sql`
    CREATE TABLE IF NOT EXISTS "comment_votes" (
        "id"          text PRIMARY KEY,
        "user_id"     text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "comment_id"  text NOT NULL REFERENCES "comments"("id") ON DELETE CASCADE,
        "value"       smallint NOT NULL,
        "created_at"  timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "uniq_comment_votes_user_comment" UNIQUE ("user_id", "comment_id")
    )
`
console.log('✓ comment_votes table created')

await sql`CREATE INDEX IF NOT EXISTS "idx_comment_votes_comment" ON "comment_votes" ("comment_id")`
console.log('✓ index on comment_votes(comment_id) created')
