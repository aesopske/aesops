import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as authSchema from './schema/auth'

export const schema = {
    ...authSchema,
}

const connectionString = process.env.DATABASE_URL!

// For migrations and queries
const client = postgres(connectionString)
export const db = drizzle(client, { schema })

export * from 'drizzle-orm'
export * from './schema/auth'
