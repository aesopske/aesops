import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { storageEnv } from '@repo/env/storage'
import type {
    StorageProvider,
    CreateUploadUrlInput,
    CreateUploadUrlResult,
    SignedDownloadOptions,
} from './types'

// Cloudflare R2 is S3-compatible. Objects are private; reads go through
// short-lived presigned GET URLs, writes through presigned PUT URLs so bytes
// never transit our server.

const DEFAULT_EXPIRY = 300

export class R2Provider implements StorageProvider {
    readonly name = 'r2'
    private client: S3Client | null = null
    private bucketName: string | null = null
    private endpoint: string | null = null

    private config() {
        if (this.client && this.bucketName && this.endpoint) {
            return { client: this.client, bucket: this.bucketName, endpoint: this.endpoint }
        }
        const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } =
            storageEnv
        if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
            throw new Error(
                'R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET.',
            )
        }
        this.endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
        this.client = new S3Client({
            region: 'auto',
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
            // R2 rejects the CRC32 checksum headers the SDK adds by default,
            // which otherwise breaks presigned PUT/GET. Only checksum when the
            // operation genuinely requires it.
            requestChecksumCalculation: 'WHEN_REQUIRED',
            responseChecksumValidation: 'WHEN_REQUIRED',
        })
        this.bucketName = R2_BUCKET
        return { client: this.client, bucket: this.bucketName, endpoint: this.endpoint }
    }

    async createUploadUrl(input: CreateUploadUrlInput): Promise<CreateUploadUrlResult> {
        const { client, bucket, endpoint } = this.config()
        // Content-Length is intentionally not signed (browsers set it and a
        // mismatch would break the signature); size is validated server-side.
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: input.key,
            ContentType: input.contentType,
        })
        const url = await getSignedUrl(client, command, {
            expiresIn: input.expiresIn ?? DEFAULT_EXPIRY,
        })
        return {
            url,
            key: input.key,
            objectUrl: `${endpoint}/${bucket}/${input.key}`,
            headers: { 'Content-Type': input.contentType },
        }
    }

    async getSignedDownloadUrl(key: string, opts?: SignedDownloadOptions): Promise<string> {
        const { client, bucket } = this.config()
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
            ...(opts?.downloadName && {
                ResponseContentDisposition: `attachment; filename="${opts.downloadName.replace(/"/g, '')}"`,
            }),
        })
        return getSignedUrl(client, command, { expiresIn: opts?.expiresIn ?? DEFAULT_EXPIRY })
    }

    async putObject(
        key: string,
        body: Uint8Array,
        contentType: string,
    ): Promise<{ key: string; objectUrl: string }> {
        const { client, bucket, endpoint } = this.config()
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
        await (client as unknown as {
            send: (c: typeof command) => Promise<unknown>
        }).send(command)
        return { key, objectUrl: `${endpoint}/${bucket}/${key}` }
    }

    async delete(keys: string[]): Promise<void> {
        if (keys.length === 0) return
        const { client, bucket } = this.config()
        const command = new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
        // `S3Client.send` is inherited from the smithy base client, which fails
        // to resolve under `preserveSymlinks` + pnpm in some consumers. Assert
        // just the method to stay portable across tsconfig settings.
        await (client as unknown as {
            send: (c: typeof command) => Promise<unknown>
        }).send(command)
    }
}
