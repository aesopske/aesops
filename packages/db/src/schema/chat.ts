import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { documents } from './documents'

export const chatMessages = pgTable('chat_messages', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    datasetId: text('dataset_id')
        .notNull()
        .references(() => documents.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['user', 'assistant'] })
        .$type<'user' | 'assistant'>()
        .notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
