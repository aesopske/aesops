import Link from 'next/link'
import Heading from '@components/common/atoms/Heading'
import { MIN_POST, POST } from '@sanity/utils/types'
import AuthorCard from '../author-card/AuthorCard'
import { cn } from '@src/lib/utils'
import { format } from 'date-fns'
import { titleCase } from '@src/lib/titleCase'
import { Badge } from '@src/components/ui/badge'
import Text from '@components/common/atoms/Text'

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
                    <Text className='line-clamp-3 text-base text-aes-dark/70 lg:text-sm'>
                        {post.excerpt}
                    </Text>
                </div>

                <div>
                    {hideAuthor && (
                        <Text className='text-sm text-gray-500'>
                            <span>
                                {format(
                                    new Date(post?.publishedAt),
                                    'MMM dd, yyyy'
                                )}
                            </span>{' '}
                            &bull; <span>{post?.readTime} min read</span>
                        </Text>
                    )}
                    {!hideAuthor && (
                        <AuthorCard
                            isSmall
                            author={post.author}
                            readTime={post.readTime}
                            date={new Date(post.publishedAt).toDateString()}
                        />
                    )}
                </div>
            </div>
        </Link>
    )
}
export default SmallPostCard
