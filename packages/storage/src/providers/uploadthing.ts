import { UTApi } from 'uploadthing/server'
import type { StorageProvider } from './types'

export class UploadThingProvider implements StorageProvider {
    readonly name = 'uploadthing'
    private readonly utapi: UTApi

    constructor() {
        this.utapi = new UTApi()
    }

    async delete(keys: string[]): Promise<void> {
        const result = await this.utapi.deleteFiles(keys)
        if (!result.success) {
            throw new Error(`Failed to delete files from UploadThing: ${keys.join(', ')}`)
        }
    }
}
