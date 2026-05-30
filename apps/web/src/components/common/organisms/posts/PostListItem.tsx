import { ArrowRight, Clock } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import { titleCase } from '@/lib/titleCase'
import { MIN_POST } from '~sanity/utils/types'

function PostListItem({ post }: { post: MIN_POST }) {
    const category = post.categories?.[0]
    const transitionName = `post-title-${post.slug?.current?.replace(/[^a-z0-9]/gi, '-') ?? ''}`
    return (
        <article className='group py-6 border-b border-border/60 last:border-0 flex flex-col gap-2'>
            {/* Meta row */}
            <div className='flex items-center gap-2 text-[10px] font-mono tracking-[0.14em] uppercase'>
                {category && (
                    <>
                        <span className='text-primary/70 group-hover:text-primary transition-colors duration-200'>
                            {category.title}
                        </span>
                        <span className='text-border'>·</span>
                    </>
                )}
                {post.publishedAt && (
                    <span className='text-muted-foreground'>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                )}
                {post.readTime ? (
                    <>
                        <span className='text-border'>·</span>
                        <span className='flex items-center gap-1 text-muted-foreground'>
                            <Clock className='w-2.5 h-2.5' />
                            {post.readTime} min
                        </span>
                    </>
                ) : null}
            </div>

            {/* Title */}
            <TransitionLink href={`/blog/${post.slug?.current}`} className='group/link'>
                <h3
                    className='font-sans font-bold text-xl md:text-2xl tracking-tight text-foreground group-hover/link:text-primary transition-colors duration-200 leading-snug'
                    style={{ viewTransitionName: transitionName }}>
                    {titleCase(post.title)}
                </h3>
            </TransitionLink>

            {/* Excerpt */}
            {post.excerpt && (
                <p className='text-muted-foreground text-base leading-relaxed line-clamp-2 max-w-2xl'>
                    {post.excerpt}
                </p>
            )}

            <div className='flex items-center justify-between pt-1'>
                {post.author?.[0]?.name && (
                    <span className='text-xs text-muted-foreground font-sans capitalize'>
                        By {post.author[0].name}
                    </span>
                )}
                <TransitionLink
                    href={`/blog/${post.slug?.current}`}
                    className='inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary/70 hover:text-primary hover:gap-2.5 transition-all duration-200 ml-auto'>
                    Read full story
                    <ArrowRight className='w-3.5 h-3.5' />
                </TransitionLink>
            </div>
        </article>
    )
}

export default PostListItem
