import 'server-only'
import { UploadThingProvider } from './providers/uploadthing'
import { DocumentService } from './service'

export type { StorageProvider, CreateDocumentInput } from './providers/types'
export { DocumentService } from './service'
export { UploadThingProvider } from './providers/uploadthing'

// Singleton using the UploadThing provider — swap by instantiating DocumentService
// with a different StorageProvider implementation.
const provider = new UploadThingProvider()
export const documentService = new DocumentService(provider)
