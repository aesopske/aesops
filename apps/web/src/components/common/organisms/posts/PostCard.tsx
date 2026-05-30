import { ArrowUpRight, Clock } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import { titleCase } from '@/lib/titleCase'
import { cn } from '@/lib/utils'
import { MIN_POST, POST } from '~sanity/utils/types'
import AuthorCard from '../author-card/AuthorCard'

type postCardProps = {
    post: POST | MIN_POST
    hideAuthor?: boolean
    className?: string
    hideImage?: boolean
    hideCategory?: boolean
    topPick?: boolean
}

function PostCard({
    post,
    topPick,
    hideAuthor,
    className,
    hideCategory = false,
}: postCardProps) {
    const categories = post?.categories?.length > 0 ? post.categories : []
    const category = categories[0]

    return (
        <div
            className={cn(
                'group relative bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]',
                topPick && 'border-primary/20',
                className,
            )}>
            {/* Left accent bar — animates in on hover */}
            <div className='absolute left-0 top-0 bottom-0 w-[2px] bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r' />

            <div className='flex flex-col gap-3 p-5 flex-1'>
                {/* Category + Top pick */}
                <div className='flex items-center gap-2 min-h-[1rem]'>
                    {topPick && (
                        <span className='text-[9px] font-mono font-semibold tracking-[0.16em] uppercase text-accent border border-accent/30 bg-accent/10 px-2 py-0.5 rounded'>
                            Top Pick
                        </span>
                    )}
                    {!hideCategory && category && (
                        <span className='text-[10px] font-mono font-medium tracking-[0.16em] uppercase text-primary/60 group-hover:text-primary/80 transition-colors duration-200'>
                            {category.title}
                        </span>
                    )}
                </div>

                {/* Title + excerpt */}
                <TransitionLink
                    href={`/blog/${post?.slug?.current}`}
                    className='flex flex-col gap-2 flex-1'>
                    <h3
                        className={cn(
                            'font-sans tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 leading-snug',
                            topPick
                                ? 'text-xl font-extrabold'
                                : 'text-base font-bold',
                        )}>
                        {titleCase(post?.title)}
                    </h3>
                    {post?.excerpt && (
                        <p className='text-muted-foreground text-sm leading-relaxed line-clamp-3'>
                            {post.excerpt}
                        </p>
                    )}
                </TransitionLink>
            </div>

            {/* Footer */}
            <div className='px-5 pb-4 pt-3 border-t border-border/50 flex items-center justify-between gap-3'>
                {hideAuthor ? (
                    <>
                        <span className='text-xs text-muted-foreground font-mono'>
                            {new Date(post?.publishedAt).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </span>
                        {post?.readTime ? (
                            <span className='flex items-center gap-1 text-xs text-muted-foreground font-mono'>
                                <Clock className='w-3 h-3' />
                                {post.readTime} min
                            </span>
                        ) : null}
                    </>
                ) : (
                    <>
                        <AuthorCard
                            isSmall
                            author={post?.author}
                            readTime={post?.readTime}
                            className='text-muted-foreground flex-1 min-w-0'
                            date={new Date(post?.publishedAt).toDateString()}
                        />
                        <ArrowUpRight className='w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors duration-200 shrink-0' />
                    </>
                )}
            </div>
        </div>
    )
}

export default PostCard
