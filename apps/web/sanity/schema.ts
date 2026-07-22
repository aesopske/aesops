import heroBlock from './schemaTypes/blocks/heroBlock'
import blogListBlock from './schemaTypes/blocks/blogListBlock'
import featuredPostsBlock from './schemaTypes/blocks/featuredPostsBlock'
import pageHeroBlock from './schemaTypes/blocks/pageHeroBlock'
import recentPostsBlock from './schemaTypes/blocks/recentPostsBlock'
import featuresBlock from './schemaTypes/blocks/featuresBlock'
import ourStoryBlock from './schemaTypes/blocks/ourStoryBlock'
import missionVisionBlock from './schemaTypes/blocks/missionVisionBlock'
import ourValuesBlock from './schemaTypes/blocks/ourValuesBlock'
import ourTeamBlock from './schemaTypes/blocks/ourTeamBlock'
import aiShowcaseBlock from './schemaTypes/blocks/aiShowcaseBlock'
import leadFormBlock from './schemaTypes/blocks/leadFormBlock'
import contactDetailsBlock from './schemaTypes/blocks/contactDetailsBlock'
import author from './schemaTypes/documents/author'
import team from './schemaTypes/documents/team'
import category from './schemaTypes/documents/category'
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
import cta from './schemaTypes/objects/cta'
import externalLink from './schemaTypes/objects/externalLink'
import pageSections from './schemaTypes/objects/pageSections'
import sectionContent from './schemaTypes/objects/sectionContent'
import tableBlock from './schemaTypes/objects/tableBlock'
import youtubeEmbed from './schemaTypes/objects/youtubeEmbed'

// import customUrl from './schemaTypes/objects/customUrl'

export const schema = {
    types: [
        // documents
        siteSettings,
        page,
        post,
        dataset,
        author,
        team,
        category,

        // blocks
        heroBlock,
        pageHeroBlock,
        blogListBlock,
        featuredPostsBlock,
        recentPostsBlock,
        featuresBlock,
        ourStoryBlock,
        missionVisionBlock,
        ourValuesBlock,
        ourTeamBlock,
        aiShowcaseBlock,
        leadFormBlock,
        contactDetailsBlock,

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
        values,
        service,
        NotesBlock,
        // customUrl,
    ],
}
