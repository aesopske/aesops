import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './auth'

export type MetadataDiff = {
    rowCountDelta: number
    columnCountDelta: number
    addedColumns: string[]
    removedColumns: string[]
    modifiedColumns: {
        name: string
        changes: { field: string; before: number | string; after: number | string }[]
    }[]
}

export type ColumnStats = {
    name: string
    dtype: string
    nullCount: number
    nullPercent: number
    uniqueCount: number
    // numeric columns (from describe())
    mean?: number
    std?: number
    min?: number
    max?: number
    median?: number
    // categorical columns
    topValues?: { value: string; count: number }[]
    sampleValues?: (string | number | null)[]
}

export type DocumentMetadata = {
    rowCount: number
    columnCount: number
    columns: ColumnStats[]
    // first 5 rows — used as AI context for the dataset
    sampleRows: Record<string, unknown>[]
    sheetNames?: string[]
    analyzedSheet?: string
}

export const documents = pgTable('documents', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    url: text('url').notNull(),
    storageKey: text('storage_key').notNull(),
    size: integer('size').notNull(),
    mimeType: text('mime_type').notNull(),
    // which provider stored this file — keeps urls/keys portable across providers
    provider: text('provider').notNull().default('uploadthing'),
    // nullable to allow uploads before full auth is wired
    uploadedBy: text('uploaded_by').references(() => users.id, {
        onDelete: 'set null',
    }),
    metadata: jsonb('metadata').$type<DocumentMetadata>(),
    description: jsonb('description'),
    license: text('license'),
    groupId: uuid('group_id'),
    aiInsights: text('ai_insights'),
    aiInsightsAt: timestamp('ai_insights_at'),
    slug: text('slug').unique(),
    parentId: text('parent_id'),
    metadataDiff: jsonb('metadata_diff').$type<MetadataDiff>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
