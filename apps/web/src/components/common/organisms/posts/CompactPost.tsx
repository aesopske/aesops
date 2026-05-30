import { ArrowRight, Clock } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import { titleCase } from '@/lib/titleCase'
import { MIN_POST } from '~sanity/utils/types'

function CompactPost({ post }: { post: MIN_POST }) {
    const category = post.categories?.[0]
    const transitionName = `post-title-${post.slug?.current?.replace(/[^a-z0-9]/gi, '-') ?? ''}`

    return (
        <TransitionLink
            href={`/blog/${post.slug?.current}`}
            className='group relative flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/[0.025] transition-all duration-300 overflow-hidden flex-1'>
            {/* Left accent bar */}
            <div className='absolute left-0 top-0 bottom-0 w-[2px] bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r' />

            <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                    {category && (
                        <span className='text-[10px] font-mono font-medium tracking-[0.16em] uppercase text-primary/60 group-hover:text-primary transition-colors duration-200'>
                            {category.title}
                        </span>
                    )}
                    <h4
                        className='font-sans font-semibold text-md leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 mt-1'
                        style={{ viewTransitionName: transitionName }}>
                        {titleCase(post.title)}
                    </h4>
                </div>
                <ArrowRight className='w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1' />
            </div>

            {post.excerpt && (
                <p className='text-muted-foreground text-sm leading-relaxed line-clamp-2'>
                    {post.excerpt}
                </p>
            )}

            {post.readTime ? (
                <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono mt-auto pt-1 border-t border-border/40'>
                    <Clock className='w-3 h-3 shrink-0' />
                    {post.readTime} min
                    {post.publishedAt && (
                        <>
                            <span className='w-0.5 h-0.5 rounded-full bg-muted-foreground/40' />
                            <span>
                                {new Date(post.publishedAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'short',
                                        year: 'numeric',
                                    },
                                )}
                            </span>
                        </>
                    )}
                </div>
            ) : null}
        </TransitionLink>
    )
}

export default CompactPost
