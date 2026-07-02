import 'server-only'
import { UploadThingProvider } from './providers/uploadthing'
import { R2Provider } from './providers/r2'
import { DocumentService } from './service'

export type {
    StorageProvider,
    CreateDocumentInput,
    CreateUploadUrlInput,
    CreateUploadUrlResult,
    SignedDownloadOptions,
} from './providers/types'
export { DocumentService } from './service'
export { UploadThingProvider } from './providers/uploadthing'
export { R2Provider } from './providers/r2'

// Provider registry keyed by the `documents.provider` column. New uploads go to
// R2; legacy UploadThing documents remain readable via their stored public URL.
const providers = {
    uploadthing: new UploadThingProvider(),
    r2: new R2Provider(),
}

export const documentService = new DocumentService(providers, 'r2')
