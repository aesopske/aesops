import { defineConfig } from 'drizzle-kit'
import { databaseEnv } from '@repo/env/database'

export default defineConfig({
    schema: './src/schema/index.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseEnv.DATABASE_URL,
    },
})
