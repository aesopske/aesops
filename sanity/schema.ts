import { type SchemaTypeDefinition } from 'sanity'
import author from './schemaTypes/documents/author'
import category from './schemaTypes/documents/category'
import competition from './schemaTypes/documents/competition'
import dataset from './schemaTypes/documents/datasets'
import page from './schemaTypes/documents/page'
import post from './schemaTypes/documents/post'
import service from './schemaTypes/documents/service'
import siteSettings from './schemaTypes/documents/siteSettings'
import values from './schemaTypes/documents/value'
import iframeEmbed from './schemaTypes/objects/IframeEmbed'
import NotesBlock from './schemaTypes/objects/NotesBlock'
import blockContent from './schemaTypes/objects/blockContent'
import codeBlock from './schemaTypes/objects/codeBlock'
import competitionInfo from './schemaTypes/objects/competitionInfo'
import cta from './schemaTypes/objects/cta'
import externalLink from './schemaTypes/objects/externalLink'
import pageSections from './schemaTypes/objects/pageSections'
import sectionContent from './schemaTypes/objects/sectionContent'
import tableBlock from './schemaTypes/objects/tableBlock'
import youtubeEmbed from './schemaTypes/objects/youtubeEmbed'

// import customUrl from './schemaTypes/objects/customUrl'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        // documents
        siteSettings,
        page,
        post,
        dataset,
        author,
        category,
        competition,

        // objects
        blockContent,
        externalLink,
        youtubeEmbed,
        iframeEmbed,
        tableBlock,
        codeBlock,
        pageSections,
        sectionContent,
        cta,
        NotesBlock,
        values,
        service,
        competitionInfo,
        // customUrl,
    ],
}
