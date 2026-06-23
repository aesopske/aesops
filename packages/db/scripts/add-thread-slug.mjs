import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

function makeSlug(title, id) {
    const base = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/, '')
        .slice(0, 60)
        .replace(/-+$/, '')
    return `${base}-${id.slice(0, 8)}`
}

await sql`ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "slug" text UNIQUE`
console.log('✓ slug column added')

const rows = await sql`SELECT id, title FROM "threads" WHERE slug IS NULL`

for (const row of rows) {
    const slug = makeSlug(row.title, row.id)
    await sql`UPDATE "threads" SET slug = ${slug} WHERE id = ${row.id}`
}

console.log(`✓ Backfilled ${rows.length} thread(s)`)
