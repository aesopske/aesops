import type { DocumentMetadata, MetadataDiff } from '@repo/db/schema'

export interface StorageProvider {
    /** Identifier stored in the database so we know which adapter to call for management ops */
    readonly name: string
    delete(keys: string[]): Promise<void>
}

export type CreateDocumentInput = {
    name: string
    url: string
    storageKey: string
    size: number
    mimeType: string
    uploadedBy?: string | null
    metadata?: DocumentMetadata | null
    description?: unknown
    license?: string | null
    groupId?: string | null
    aiInsights?: string | null
    parentId?: string | null
    metadataDiff?: MetadataDiff | null
}
