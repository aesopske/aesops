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

export type AnomalyDetails = {
    previousDocId: string
    previousRowCount: number
    removedCount: number
    removedPercent: number
    thresholdPercent: number
    schemaChanged: boolean
    detectedAt: string
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
    // derived Parquet artifact (query/version substrate); null until generated
    parquetKey: text('parquet_key'),
    // merged Parquet across all versions (root docs only); null until the
    // merge job has run at least once
    mergedParquetKey: text('merged_parquet_key'),
    mergedParquetUpdatedAt: timestamp('merged_parquet_updated_at'),
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
    // free text: a URL, the name of an original dataset, or a note about how
    // this dataset was combined/derived
    source: text('source'),
    groupId: uuid('group_id'),
    aiInsights: text('ai_insights'),
    aiInsightsAt: timestamp('ai_insights_at'),
    category: text('category'),
    tags: jsonb('tags').$type<string[]>(),
    classifiedAt: timestamp('classified_at'),
    slug: text('slug').unique(),
    parentId: text('parent_id'),
    metadataDiff: jsonb('metadata_diff').$type<MetadataDiff>(),
    // sha256 of the raw uploaded file bytes — lets an upload short-circuit
    // (skip storage/Parquet/insights work entirely) when a source resends
    // byte-identical data
    contentHash: text('content_hash'),
    // bumped when an upload is checked and found unchanged (contentHash
    // matched), without touching updatedAt — keeps updatedAt meaning "content
    // actually changed"
    lastCheckedAt: timestamp('last_checked_at'),
    // 'active' | 'pending_review' — a revision is held out of the query path
    // (see resolveQueryDoc) when an automated anomaly check flags it
    reviewStatus: text('review_status').notNull().default('active'),
    anomalyDetails: jsonb('anomaly_details').$type<AnomalyDetails>(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
