import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const aiUsageEvents = pgTable('ai_usage_events', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    route: text('route').notNull(),
    model: text('model').notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    promptTokens: integer('prompt_tokens'),
    completionTokens: integer('completion_tokens'),
    totalTokens: integer('total_tokens'),
    latencyMs: integer('latency_ms').notNull(),
    success: boolean('success').notNull(),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
