import type { Image } from 'sanity'
import createImageUrlBuilder from '@sanity/image-url'
import { SanityAsset } from '@sanity/image-url/lib/types/types'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

export const urlForImage = (source: SanityAsset) => {
    return imageBuilder?.image(source).auto('format').fit('max').url()
}
