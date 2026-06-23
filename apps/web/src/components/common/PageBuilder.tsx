import {
    AiShowcaseBlock,
    BlogListBlock,
    FeaturedPostsBlock,
    FeaturesBlock,
    HeroBlock,
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

function PageBuilder({ blocks }: { blocks: PageBlock[] }) {
    return (
        <>
            {blocks.map((block) => {
                switch (block._type) {
                    case 'heroBlock':
                        return <Hero key={block._key} block={block as HeroBlock} />
                    case 'pageHeroBlock':
                        return <PageHero key={block._key} block={block as PageHeroBlock} />
                    case 'blogListBlock':
                        return <SearchableBlogList key={block._key} block={block as BlogListBlock} />
                    case 'featuredPostsBlock':
                        return <FeaturedPostsSection key={block._key} block={block as FeaturedPostsBlock} />
                    case 'recentPostsBlock':
                        return <RecentPostsSection key={block._key} block={block as RecentPostsBlock} />
                    case 'featuresBlock':
                        return <FeaturesSection key={block._key} block={block as FeaturesBlock} />
                    case 'aiShowcaseBlock':
                        return <AiShowcaseSection key={block._key} block={block as AiShowcaseBlock} />
                    case 'ourStoryBlock':
                        return <OurStoryBlockComponent key={block._key} block={block as OurStoryBlock} />
                    case 'missionVisionBlock':
                        return <MissionVisionBlockComponent key={block._key} block={block as MissionVisionBlock} />
                    case 'ourValuesBlock':
                        return <OurValuesBlockComponent key={block._key} block={block as OurValuesBlock} />
                    case 'ourTeamBlock':
                        return <OurTeamBlockComponent key={block._key} block={block as OurTeamBlock} />
                    default:
                        return null
                }
            })}
        </>
    )
}

export default PageBuilder
