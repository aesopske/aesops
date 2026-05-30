import { ArrowRight, Clock } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import { titleCase } from '@/lib/titleCase'
import { MIN_POST } from '~sanity/utils/types'

function HeroPost({ post }: { post: MIN_POST }) {
    const category = post.categories?.[0]
    const transitionName = `post-title-${post.slug?.current?.replace(/[^a-z0-9]/gi, '-') ?? ''}`

    return (
        <TransitionLink
            href={`/blog/${post.slug?.current}`}
            className='group relative flex flex-col justify-end overflow-hidden rounded-xl min-h-[20rem] lg:min-h-[26rem]'>
            {/* Base surface */}
            <div className='absolute inset-0 bg-primary' />

            {/* Dot-grid texture */}
            <div
                className='absolute inset-0 opacity-[0.07]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            {/* Depth gradients */}
            <div className='absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/35' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent' />

            {/* Subtle zoom on hover */}
            <div className='absolute inset-0 scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out bg-primary/0' />

            {/* Glass content card */}
            <div className='relative z-10 m-3 lg:m-5 p-4 lg:p-5 rounded-lg bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex flex-col gap-2.5 group-hover:bg-white/[0.12] transition-colors duration-300'>
                {category && (
                    <span className='inline-flex items-center gap-2 text-[10px] font-mono font-medium tracking-[0.18em] uppercase text-accent'>
                        <span className='w-1.5 h-1.5 rounded-full bg-accent shrink-0' />
                        {category.title}
                    </span>
                )}

                <h3
                    className='font-sans font-black text-xl lg:text-2xl xl:text-3xl text-white tracking-tight leading-[1.2]'
                    style={{ viewTransitionName: transitionName }}>
                    {titleCase(post.title)}
                </h3>

                {post.excerpt && (
                    <p className='text-white/55 text-sm leading-relaxed line-clamp-2 max-w-xl font-sans'>
                        {post.excerpt}
                    </p>
                )}

                <div className='flex items-center justify-between pt-1 border-t border-white/10'>
                    <div className='flex items-center gap-2 text-white/50 text-xs font-sans'>
                        {post.author?.[0]?.name && (
                            <span className='text-white/75 font-medium capitalize'>
                                {post.author[0].name}
                            </span>
                        )}
                        {post.readTime ? (
                            <>
                                <span className='w-1 h-1 rounded-full bg-white/30' />
                                <span className='flex items-center gap-1'>
                                    <Clock className='w-3 h-3' />
                                    {post.readTime} min read
                                </span>
                            </>
                        ) : null}
                    </div>

                    <span className='inline-flex items-center gap-1.5 text-accent text-xs font-mono font-medium group-hover:gap-2.5 transition-all duration-300'>
                        Read story
                        <ArrowRight className='w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300' />
                    </span>
                </div>
            </div>
        </TransitionLink>
    )
}

export default HeroPost
