import urlBuilder from '@sanity/image-url'
import { projectId, dataset } from '../../../sanity/env'
import { SanityImageAsset } from '@sanity/asset-utils'

export const urlFor = (source: SanityImageAsset) => {
    return urlBuilder({ projectId, dataset }).image(source)
}
