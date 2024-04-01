import { type SchemaTypeDefinition } from 'sanity'

// documents
import siteSettings from './schemaTypes/documents/siteSettings'
import category from './schemaTypes/documents/category'
import post from './schemaTypes/documents/post'
import author from './schemaTypes/documents/author'
import dataset from './schemaTypes/documents/datasets'

// objects
import blockContent from './schemaTypes/objects/blockContent'
import externalLink from './schemaTypes/objects/externalLink'
import youtubeEmbed from './schemaTypes/objects/youtubeEmbed'
import iframeEmbed from './schemaTypes/objects/IframeEmbed'
import tableBlock from './schemaTypes/objects/tableBlock'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        // documents
        siteSettings,
        post,
        dataset,
        author,
        category,

        // objects
        blockContent,
        externalLink,
        youtubeEmbed,
        iframeEmbed,
        tableBlock,
    ],
}
