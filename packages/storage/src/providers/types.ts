import type { DocumentMetadata, MetadataDiff } from '@repo/db/schema'

export type CreateUploadUrlInput = {
    /** Object key to write to (caller controls the storage layout) */
    key: string
    contentType: string
    contentLength?: number
    /** Presigned URL lifetime in seconds */
    expiresIn?: number
}

export type CreateUploadUrlResult = {
    /** Presigned URL the client PUTs the file bytes to */
    url: string
    key: string
    /** Stable (non-signed) reference to the stored object, for the `url` column */
    objectUrl: string
    /** Headers the client MUST send on the PUT for the signature to match */
    headers?: Record<string, string>
}

export type SignedDownloadOptions = {
    /** Signed URL lifetime in seconds (default 300) */
    expiresIn?: number
    /** Sets Content-Disposition so the browser downloads with this filename */
    downloadName?: string
}

export interface StorageProvider {
    /** Identifier stored in the database so we know which adapter to call for management ops */
    readonly name: string
    delete(keys: string[]): Promise<void>
    /** Presign a direct client upload. Not all providers support this. */
    createUploadUrl(input: CreateUploadUrlInput): Promise<CreateUploadUrlResult>
    /** Short-lived authenticated download URL for a private object. */
    getSignedDownloadUrl(key: string, opts?: SignedDownloadOptions): Promise<string>
    /** Server-side write of an object (e.g. derived Parquet). Returns object ref. */
    putObject(key: string, body: Uint8Array, contentType: string): Promise<{ key: string; objectUrl: string }>
}

export type CreateDocumentInput = {
    name: string
    url: string
    storageKey: string
    size: number
    mimeType: string
    /** Storage provider name; defaults to the service's upload provider. */
    provider?: string
    uploadedBy?: string | null
    metadata?: DocumentMetadata | null
    description?: unknown
    license?: string | null
    groupId?: string | null
    aiInsights?: string | null
    parentId?: string | null
    metadataDiff?: MetadataDiff | null
}
