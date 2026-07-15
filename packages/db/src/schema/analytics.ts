import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { documents } from './documents'

export const datasetDownloads = pgTable(
    'dataset_downloads',
    {
        id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
        documentId: text('document_id')
            .notNull()
            .references(() => documents.id, { onDelete: 'cascade' }),
        userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        index('dataset_downloads_document_id_created_at_idx').on(
            table.documentId,
            table.createdAt,
        ),
        index('dataset_downloads_user_id_created_at_idx').on(
            table.userId,
            table.createdAt,
        ),
    ],
)
