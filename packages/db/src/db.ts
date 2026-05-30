import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { databaseEnv } from '@repo/env/database'
import * as schema from './schema'

const sql = neon(databaseEnv.DATABASE_URL)

export const db = drizzle({ client: sql, schema })
