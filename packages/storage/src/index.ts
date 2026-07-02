import 'server-only'
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
export { R2Provider } from './providers/r2'

// Provider registry keyed by the `documents.provider` column.
const providers = {
    r2: new R2Provider(),
}

export const documentService = new DocumentService(providers, 'r2')
