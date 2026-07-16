import 'server-only'
import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, isNull, lte, or, sql } from 'drizzle-orm'
import { db, documents } from '@repo/db'
import type {
    StorageProvider,
    CreateDocumentInput,
    CreateUploadUrlInput,
    SignedDownloadOptions,
} from './providers/types'

type DownloadableDoc = {
    provider: string
    storageKey: string
    url: string
    name: string
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
}

export class DocumentService {
    constructor(
        private readonly providers: Record<string, StorageProvider>,
        private readonly uploadProviderName: string,
        private readonly database: typeof db = db,
    ) {}

    private resolveProvider(name: string): StorageProvider {
        const provider = this.providers[name]
        if (!provider)
            throw new Error(`No storage provider registered for '${name}'`)
        return provider
    }

    /** Presign a direct client upload using the current upload provider. */
    createUploadUrl(input: CreateUploadUrlInput) {
        return this.resolveProvider(this.uploadProviderName).createUploadUrl(input)
    }

    /** Server-side object write using the current upload provider. */
    putObject(key: string, body: Uint8Array, contentType: string) {
        return this.resolveProvider(this.uploadProviderName).putObject(key, body, contentType)
    }

    /** Server-side object delete using the current upload provider. */
    deleteObject(key: string) {
        return this.resolveProvider(this.uploadProviderName).delete([key])
    }

    async setParquetKey(id: string, parquetKey: string) {
        const [doc] = await this.database
            .update(documents)
            .set({ parquetKey, updatedAt: new Date() })
            .where(eq(documents.id, id))
            .returning()
        return doc!
    }

    async setMergedParquetKey(id: string, parquetKey: string) {
        const [doc] = await this.database
            .update(documents)
            .set({ mergedParquetKey: parquetKey, mergedParquetUpdatedAt: new Date(), updatedAt: new Date() })
            .where(eq(documents.id, id))
            .returning()
        return doc!
    }

    /** Signed URL for a derived Parquet object (always on the upload provider). */
    getParquetUrl(parquetKey: string, opts?: SignedDownloadOptions) {
        return this.resolveProvider(this.uploadProviderName).getSignedDownloadUrl(parquetKey, opts)
    }

    /** Signed, short-lived URL to read the raw object (e.g. server-side parsing). */
    async resolveReadUrl(
        doc: { provider: string; storageKey: string; url: string },
        opts?: SignedDownloadOptions,
    ): Promise<string> {
        return this.resolveProvider(doc.provider).getSignedDownloadUrl(doc.storageKey, opts)
    }

    /** Browser download URL; sets Content-Disposition to the document name. */
    resolveDownloadUrl(
        doc: DownloadableDoc,
        opts?: SignedDownloadOptions,
    ): Promise<string> {
        return this.resolveReadUrl(doc, { downloadName: doc.name, ...opts })
    }

    private async generateUniqueSlug(name: string): Promise<string> {
        const base = slugify(name) || 'dataset'
        let candidate = base
        let attempt = 1
        for (;;) {
            const existing = await this.database
                .select({ id: documents.id })
                .from(documents)
                .where(eq(documents.slug, candidate))
                .limit(1)
            if (!existing.length) return candidate
            candidate = `${base}-${++attempt}`
        }
    }

    async create(input: CreateDocumentInput) {
        const slug = await this.generateUniqueSlug(input.name)
        const [doc] = await this.database
            .insert(documents)
            .values({
                name: input.name,
                url: input.url,
                storageKey: input.storageKey,
                size: input.size,
                mimeType: input.mimeType,
                provider: input.provider ?? this.uploadProviderName,
                uploadedBy: input.uploadedBy ?? null,
                metadata: input.metadata ?? null,
                description: input.description ?? null,
                license: input.license ?? null,
                source: input.source ?? null,
                groupId: input.groupId ?? null,
                aiInsights: input.aiInsights ?? null,
                aiInsightsAt: input.aiInsights ? new Date() : null,
                slug,
                parentId: input.parentId ?? null,
                metadataDiff: input.metadataDiff ?? null,
            })
            .returning()
        return doc!
    }

    private async attachRevisionCounts<T extends { id: string }>(
        rows: T[],
    ): Promise<(T & { revisionCount: number; latestRevisionAt: Date | null })[]> {
        if (rows.length === 0)
            return rows.map((r) => ({ ...r, revisionCount: 0, latestRevisionAt: null }))

        const counts = await this.database
            .select({
                parentId: documents.parentId,
                revisionCount: sql<number>`count(*)::int`,
                latestRevisionAt: sql<Date | null>`max(${documents.createdAt})`,
            })
            .from(documents)
            .where(inArray(documents.parentId, rows.map((r) => r.id)))
            .groupBy(documents.parentId)

        const countMap = new Map(
            counts.map((c) => [
                c.parentId,
                { revisionCount: c.revisionCount, latestRevisionAt: c.latestRevisionAt },
            ]),
        )

        return rows.map((r) => ({
            ...r,
            revisionCount: countMap.get(r.id)?.revisionCount ?? 0,
            latestRevisionAt: countMap.get(r.id)?.latestRevisionAt ?? null,
        }))
    }

    async list() {
        const rows = await this.database.query.documents.findMany({
            where: isNull(documents.parentId),
            orderBy: (t, { desc }) => [desc(t.createdAt)],
        })
        return this.attachRevisionCounts(rows)
    }

    async search(query: string) {
        const q = `%${query}%`
        const rows = await this.database
            .select()
            .from(documents)
            .where(
                and(
                    isNull(documents.parentId),
                    or(
                        ilike(documents.name, q),
                        sql`${documents.metadata}::text ilike ${q}`,
                    ),
                ),
            )
            .orderBy(desc(documents.createdAt))
        return this.attachRevisionCounts(rows)
    }

    /** Paginated, filterable dataset browse — powers the public datasets page. */
    async browse(filters: {
        query?: string
        license?: string[]
        minSize?: number
        maxSize?: number
        minRows?: number
        maxRows?: number
        page?: number
        pageSize?: number
    } = {}) {
        const { query, license, minSize, maxSize, minRows, maxRows } = filters
        const page = filters.page ?? 1
        const pageSize = filters.pageSize ?? 20

        const conditions = [isNull(documents.parentId)]
        if (query) {
            const q = `%${query}%`
            conditions.push(
                or(
                    ilike(documents.name, q),
                    sql`${documents.metadata}::text ilike ${q}`,
                )!,
            )
        }
        if (license?.length) conditions.push(inArray(documents.license, license))
        if (minSize !== undefined) conditions.push(gte(documents.size, minSize))
        if (maxSize !== undefined) conditions.push(lte(documents.size, maxSize))
        if (minRows !== undefined)
            conditions.push(sql`(${documents.metadata}->>'rowCount')::int >= ${minRows}`)
        if (maxRows !== undefined)
            conditions.push(sql`(${documents.metadata}->>'rowCount')::int <= ${maxRows}`)

        const where = and(...conditions)

        const [rows, countRows] = await Promise.all([
            this.database
                .select()
                .from(documents)
                .where(where)
                .orderBy(desc(documents.createdAt))
                .limit(pageSize)
                .offset((page - 1) * pageSize),
            this.database
                .select({ count: sql<number>`count(*)::int` })
                .from(documents)
                .where(where),
        ])

        const items = await this.attachRevisionCounts(rows)
        return { items, total: countRows[0]?.count ?? 0 }
    }

    /** Distinct license values currently in use, for the browse filter panel. */
    async distinctLicenses(): Promise<string[]> {
        const rows = await this.database
            .selectDistinct({ license: documents.license })
            .from(documents)
            .where(and(isNull(documents.parentId), isNotNull(documents.license)))
        return rows
            .map((r) => r.license)
            .filter((l): l is string => l !== null)
            .sort()
    }

    async listByUser(userId: string) {
        return this.database.query.documents.findMany({
            where: eq(documents.uploadedBy, userId),
            orderBy: (t, { desc }) => [desc(t.createdAt)],
        })
    }

    async listByUserRoots(userId: string) {
        const rows = await this.database.query.documents.findMany({
            where: (t, { and, eq, isNull }) =>
                and(eq(t.uploadedBy, userId), isNull(t.parentId)),
            orderBy: (t, { desc }) => [desc(t.createdAt)],
        })
        return this.attachRevisionCounts(rows)
    }

    async searchByUser(query: string, userId: string) {
        const q = `%${query}%`
        return this.database
            .select()
            .from(documents)
            .where(
                and(
                    eq(documents.uploadedBy, userId),
                    or(
                        ilike(documents.name, q),
                        sql`${documents.metadata}::text ilike ${q}`,
                    ),
                ),
            )
            .orderBy(desc(documents.createdAt))
    }

    async getById(id: string) {
        return this.database.query.documents.findFirst({
            where: eq(documents.id, id),
        })
    }

    async getBySlug(slug: string) {
        return this.database.query.documents.findFirst({
            where: eq(documents.slug, slug),
        })
    }

    async listRevisions(parentId: string) {
        return this.database
            .select()
            .from(documents)
            .where(eq(documents.parentId, parentId))
            .orderBy(asc(documents.createdAt))
    }

    async update(
        id: string,
        input: { name?: string; description?: unknown; license?: string | null; source?: string | null },
    ) {
        const [doc] = await this.database
            .update(documents)
            .set({
                ...(input.name !== undefined && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.license !== undefined && { license: input.license }),
                ...(input.source !== undefined && { source: input.source }),
                updatedAt: new Date(),
            })
            .where(eq(documents.id, id))
            .returning()
        return doc!
    }

    async saveInsights(id: string, insights: string) {
        const [doc] = await this.database
            .update(documents)
            .set({ aiInsights: insights, aiInsightsAt: new Date(), updatedAt: new Date() })
            .where(eq(documents.id, id))
            .returning()
        return doc!
    }

    async delete(id: string) {
        const doc = await this.database.query.documents.findFirst({
            where: eq(documents.id, id),
        })
        if (!doc) throw new Error(`Document not found: ${id}`)

        await this.resolveProvider(doc.provider).delete([doc.storageKey])
        await this.database.delete(documents).where(eq(documents.id, id))
    }
}
