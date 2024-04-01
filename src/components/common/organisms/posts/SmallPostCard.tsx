import Link from 'next/link'
import Heading from '@components/common/atoms/Heading'
import { MIN_POST, POST } from '@sanity/lib/types'
import AuthorCard from '../author-card/AuthorCard'
import { cn } from '@src/lib/utils'
import { format } from 'date-fns'
import { titleCase } from '@src/lib/titleCase'
import { Badge } from '@src/components/ui/badge'

type SmallPostCardProps = {
    post: POST | MIN_POST
    hideAuthor?: boolean
    className?: string
}

function SmallPostCard({ post, hideAuthor, className }: SmallPostCardProps) {
    const categories = post.categories ?? []
    return (
        <Link href={`/blog/${post.slug.current}`} passHref>
            <div
                className={cn(
                    'bg-white border border-gray-200 p-4 rounded space-y-4',
                    className
                )}>
                <div className='flex gap-2 flex-wrap'>
                    {categories?.length > 0 ? (
                        <Badge
                            variant='default'
                            className='text-xs text-aes-light rounded-full'>
                            # {categories[0]?.title}
                        </Badge>
                    ) : null}
                </div>
                <div className='space-y-3'>
                    <Heading
                        type='h4'
                        className='font-black hover:underline hover:decoration-dotted underline-offset-8'>
                        {titleCase(post.title)}
                    </Heading>
                    <p className='line-clamp-2 text-sm text-aes-dark/70'>
                        {post.excerpt}
                    </p>
                </div>

                {hideAuthor ? (
                    <p className='text-xs text-gray-500'>
                        <span>
                            {format(
                                new Date(post?.publishedAt),
                                'MMM dd, yyyy'
                            )}
                        </span>{' '}
                        &bull; <span>{post?.readTime} min read</span>
                    </p>
                ) : (
                    <AuthorCard
                        isSmall
                        author={post.author}
                        readTime={post.readTime}
                        date={new Date(post.publishedAt).toDateString()}
                    />
                )}
            </div>
        </Link>
    )
}
export default SmallPostCard
