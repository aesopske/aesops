import { ArrowRight } from 'lucide-react'
import Animate from '@components/common/atoms/Animate'
import TransitionLink from '@components/common/atoms/TransitionLink'
import PostCard from './PostCard'
import { getRecentPosts } from '~sanity/utils/requests'
import { RecentPostsBlock } from '~sanity/utils/types'

type RecentPostsSectionProps = {
    block: RecentPostsBlock
}

async function RecentPostsSection({ block }: RecentPostsSectionProps) {
    const posts = await getRecentPosts(block.count ?? 6)

    return (
        <section className='relative overflow-hidden bg-background py-12 lg:py-16'>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.05]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                <Animate dir='up' className='mb-8'>
                    <div className='flex items-end justify-between gap-4 flex-wrap'>
                        <div className='space-y-1.5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-5 h-px bg-primary' />
                                <span className='text-[10px] font-mono font-medium tracking-[0.22em] uppercase text-primary'>
                                    Latest
                                </span>
                            </div>
                            <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight text-foreground'>
                                {block.heading ?? 'Recent Posts'}
                            </h2>
                            {block.description && (
                                <p className='text-muted-foreground text-base leading-relaxed max-w-xl pt-1'>
                                    {block.description}
                                </p>
                            )}
                        </div>
                        <TransitionLink
                            href='/blog'
                            className='inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary/70 hover:text-primary hover:gap-2.5 transition-all duration-200 pb-0.5 shrink-0'>
                            View all posts
                            <ArrowRight className='w-3.5 h-3.5' />
                        </TransitionLink>
                    </div>
                </Animate>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {posts.map((post, idx) => (
                        <Animate
                            key={post.slug?.current ?? idx}
                            dir='up'
                            duration={0.45 + idx * 0.06}>
                            <PostCard post={post} hideAuthor />
                        </Animate>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RecentPostsSection
