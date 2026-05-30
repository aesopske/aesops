import 'server-only'
import { and, asc, desc, eq, ilike, inArray, isNull, or, sql } from 'drizzle-orm'
import { db, documents } from '@repo/db'
import type { StorageProvider, CreateDocumentInput } from './providers/types'

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
}

export class DocumentService {
    constructor(
        private readonly provider: StorageProvider,
        private readonly database: typeof db = db,
    ) {}

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
                provider: this.provider.name,
                uploadedBy: input.uploadedBy ?? null,
                metadata: input.metadata ?? null,
                description: input.description ?? null,
                license: input.license ?? null,
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

    async update(id: string, input: { name?: string; description?: unknown; license?: string | null }) {
        const [doc] = await this.database
            .update(documents)
            .set({
                ...(input.name !== undefined && { name: input.name }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.license !== undefined && { license: input.license }),
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

        await this.provider.delete([doc.storageKey])
        await this.database.delete(documents).where(eq(documents.id, id))
    }
}
