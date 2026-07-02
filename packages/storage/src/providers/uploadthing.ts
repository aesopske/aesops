import { UTApi } from 'uploadthing/server'
import type {
    StorageProvider,
    CreateUploadUrlInput,
    CreateUploadUrlResult,
    SignedDownloadOptions,
} from './types'

// Legacy provider: files uploaded before the R2 migration. They are public, so
// downloads use the stored `documents.url` directly (the download route branches
// on `doc.provider`). New uploads go to R2 — presigning is intentionally absent.
export class UploadThingProvider implements StorageProvider {
    readonly name = 'uploadthing'
    private readonly utapi: UTApi

    constructor() {
        this.utapi = new UTApi()
    }

    async createUploadUrl(_input: CreateUploadUrlInput): Promise<CreateUploadUrlResult> {
        throw new Error(
            'UploadThingProvider does not support presigned uploads. New uploads use R2Provider.',
        )
    }

    async getSignedDownloadUrl(
        _key: string,
        _opts?: SignedDownloadOptions,
    ): Promise<string> {
        throw new Error(
            'UploadThing files are public; download via the stored documents.url instead.',
        )
    }

    async putObject(): Promise<{ key: string; objectUrl: string }> {
        throw new Error(
            'UploadThingProvider does not support server-side object writes. Use R2Provider.',
        )
    }

    async delete(keys: string[]): Promise<void> {
        const result = await this.utapi.deleteFiles(keys)
        if (!result.success) {
            throw new Error(`Failed to delete files from UploadThing: ${keys.join(', ')}`)
        }
    }
}
