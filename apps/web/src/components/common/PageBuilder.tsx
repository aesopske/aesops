import type { ReactNode } from 'react'
import {
    AiShowcaseBlock,
    BlogListBlock,
    ContactDetailsBlock,
    FeaturedPostsBlock,
    FeaturesBlock,
    HeroBlock,
    LeadFormBlock,
    MissionVisionBlock,
    OurStoryBlock,
    OurTeamBlock,
    OurValuesBlock,
    PageBlock,
    PageHeroBlock,
    RecentPostsBlock,
} from '~sanity/utils/types'
import Hero from './Hero'
import PageHero from './PageHero'
import FeaturedPostsSection from './organisms/posts/FeaturedPostsSection'
import SearchableBlogList from './organisms/posts/SearchableBlogList'
import RecentPostsSection from './organisms/posts/RecentPostsSection'
import FeaturesSection from './FeaturesSection'
import AiShowcaseSection from './AiShowcaseSection'
import OurStoryBlockComponent from './organisms/about/OurStoryBlock'
import MissionVisionBlockComponent from './organisms/about/MissionVisionBlock'
import OurValuesBlockComponent from './organisms/about/OurValuesBlock'
import OurTeamBlockComponent from './organisms/about/OurTeamBlock'
import LeadFormSection from './LeadFormSection'
import FeaturesWithLeadFormSection from './FeaturesWithLeadFormSection'
import ContactDetailsSection from './ContactDetailsSection'
import LeadFormWithContactDetailsSection from './LeadFormWithContactDetailsSection'

function PageBuilder({ blocks }: { blocks: PageBlock[] }) {
    const elements: ReactNode[] = []

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]!
        const next = blocks[i + 1]

        // A features grid immediately followed by a lead form renders as one
        // side-by-side section (pillars + form) instead of two stacked ones.
        if (block._type === 'featuresBlock' && next?._type === 'leadFormBlock') {
            elements.push(
                <FeaturesWithLeadFormSection
                    key={block._key}
                    featuresBlock={block as FeaturesBlock}
                    leadFormBlock={next as LeadFormBlock}
                />,
            )
            i++
            continue
        }

        // A lead form immediately followed by contact details renders as one
        // side-by-side section (form + contact details) instead of two stacked ones.
        if (block._type === 'leadFormBlock' && next?._type === 'contactDetailsBlock') {
            elements.push(
                <LeadFormWithContactDetailsSection
                    key={block._key}
                    leadFormBlock={block as LeadFormBlock}
                    contactDetailsBlock={next as ContactDetailsBlock}
                />,
            )
            i++
            continue
        }

        switch (block._type) {
            case 'heroBlock':
                elements.push(<Hero key={block._key} block={block as HeroBlock} />)
                break
            case 'pageHeroBlock':
                elements.push(<PageHero key={block._key} block={block as PageHeroBlock} />)
                break
            case 'blogListBlock':
                elements.push(<SearchableBlogList key={block._key} block={block as BlogListBlock} />)
                break
            case 'featuredPostsBlock':
                elements.push(<FeaturedPostsSection key={block._key} block={block as FeaturedPostsBlock} />)
                break
            case 'recentPostsBlock':
                elements.push(<RecentPostsSection key={block._key} block={block as RecentPostsBlock} />)
                break
            case 'featuresBlock':
                elements.push(<FeaturesSection key={block._key} block={block as FeaturesBlock} />)
                break
            case 'aiShowcaseBlock':
                elements.push(<AiShowcaseSection key={block._key} block={block as AiShowcaseBlock} />)
                break
            case 'ourStoryBlock':
                elements.push(<OurStoryBlockComponent key={block._key} block={block as OurStoryBlock} />)
                break
            case 'missionVisionBlock':
                elements.push(<MissionVisionBlockComponent key={block._key} block={block as MissionVisionBlock} />)
                break
            case 'ourValuesBlock':
                elements.push(<OurValuesBlockComponent key={block._key} block={block as OurValuesBlock} />)
                break
            case 'ourTeamBlock':
                elements.push(<OurTeamBlockComponent key={block._key} block={block as OurTeamBlock} />)
                break
            case 'leadFormBlock':
                elements.push(<LeadFormSection key={block._key} block={block as LeadFormBlock} />)
                break
            case 'contactDetailsBlock':
                elements.push(<ContactDetailsSection key={block._key} block={block as ContactDetailsBlock} />)
                break
            default:
                break
        }
    }

    return <>{elements}</>
}

export default PageBuilder
