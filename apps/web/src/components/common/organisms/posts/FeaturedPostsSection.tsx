import Animate from '@components/common/atoms/Animate'
import { FeaturedPostsBlock } from '~sanity/utils/types'
import HeroPost from './HeroPost'
import CompactPost from './CompactPost'

type FeaturedPostsSectionProps = {
    block: FeaturedPostsBlock
}

function FeaturedPostsSection({ block }: FeaturedPostsSectionProps) {
    const posts = block.posts ?? []
    const heroPost = posts[0]
    const sidePosts = posts.slice(1, 4)

    if (!heroPost) return null

    return (
        <section className='bg-background py-10 lg:py-14'>
            <div className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                <Animate dir='up' className='mb-6'>
                    <div className='flex items-end justify-between gap-4 flex-wrap'>
                        <div className='space-y-1.5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-5 h-px bg-primary' />
                                <span className='text-[10px] font-mono font-medium tracking-[0.22em] uppercase text-primary'>
                                    Featured
                                </span>
                            </div>
                            <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight text-foreground'>
                                {block.heading ?? 'Featured Stories'}
                            </h2>
                        </div>
                        <span className='text-xs font-mono text-muted-foreground pb-0.5'>
                            {posts.length} article
                            {posts.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </Animate>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <Animate dir='up' duration={0.5} className='lg:col-span-2'>
                        <HeroPost post={heroPost} />
                    </Animate>

                    {sidePosts.length > 0 && (
                        <div className='flex flex-col gap-3'>
                            {sidePosts.map((post, idx) => (
                                <Animate
                                    key={post.slug?.current ?? idx}
                                    dir='up'
                                    duration={0.45 + idx * 0.08}>
                                    <CompactPost post={post} />
                                </Animate>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default FeaturedPostsSection
