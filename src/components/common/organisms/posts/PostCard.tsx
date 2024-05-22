import Link from 'next/link'

import { cn } from '@src/lib/utils'
import Text from '../../atoms/Text'
import { titleCase } from '@src/lib/titleCase'
import { Badge } from '@src/components/ui/badge'
import { MIN_POST, POST } from '@sanity/utils/types'
import AuthorCard from '../author-card/AuthorCard'
import Heading from '@components/common/atoms/Heading'

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
    const categories = post.categories ?? []

    return (
        <div
            className={cn(
                '  bg-white border border-gray-200 p-4 rounded text-aes-dark h-full space-y-6',
                className
            )}>
            <div className='flex gap-2 flex-wrap'>
                {topPick && (
                    <Badge
                        variant='secondary'
                        className='text-aes-primary rounded-full w-fit'>
                        Top Pick
                    </Badge>
                )}
                {categories?.length > 0 || !hideCategory ? (
                    <Badge
                        variant='default'
                        className='text-aes-light rounded-full w-fit'>
                        # {categories[0]?.title}
                    </Badge>
                ) : null}
            </div>

            <div className={cn('space-y-6')}>
                <Link href={`/blog/${post.slug.current}`} passHref>
                    <div className='flex flex-col gap-2'>
                        <Heading
                            type={topPick ? 'h2' : 'h3'}
                            className={cn('font-black')}>
                            {titleCase(post.title)}
                        </Heading>
                        <Text
                            className={cn(
                                'line-clamp-3 text-base text-opacity-80 max-w-xl',
                                topPick
                                    ? 'text-base text-current text-opacity-60'
                                    : ''
                            )}>
                            {post.excerpt}
                        </Text>
                    </div>
                </Link>
                {hideAuthor ? (
                    <Text className='text-base text-opacity-70'>
                        <span>
                            {new Date(post?.publishedAt).toDateString()}
                        </span>{' '}
                        &bull; <span>{post?.readTime} min read</span>
                    </Text>
                ) : (
                    <AuthorCard
                        isSmall
                        author={post.author}
                        readTime={post.readTime}
                        className='text-opacity-70 text-current'
                        date={new Date(post.publishedAt).toDateString()}
                    />
                )}
            </div>
        </div>
    )
}
export default PostCard
