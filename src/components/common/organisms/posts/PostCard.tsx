import Link from 'next/link'
import { Badge } from '@src/components/ui/badge'
import { titleCase } from '@src/lib/titleCase'
import { cn } from '@src/lib/utils'
import { MIN_POST, POST } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'
import Text from '../../atoms/Text'
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
    const categories = post?.categories.length > 0 ? post.categories : []

    return (
        <div
            className={cn(
                '  bg-white border border-gray-200 p-4 rounded-md text-brandprimary-900 h-full flex flex-col justify-between gap-y-4',
                className,
            )}>
            <div className='space-y-4'>
                <div className='flex gap-2 flex-wrap'>
                    {topPick && (
                        <Badge
                            variant='secondary'
                            className='text-brandprimary-700 rounded-full w-fit'>
                            Top Pick
                        </Badge>
                    )}
                    {categories?.length > 0 || !hideCategory ? (
                        <Badge
                            variant='default'
                            className='text-brandaccent-50 rounded-full w-fit'>
                            # {categories[0]?.title}
                        </Badge>
                    ) : null}
                </div>

                <div className={cn('space-y-6')}>
                    <Link href={`/blog/${post?.slug?.current}`} passHref>
                        <div className='flex flex-col gap-2'>
                            <Heading type={topPick ? 'h2' : 'h3'}>
                                {titleCase(post?.title)}
                            </Heading>
                            <Text
                                className={cn(
                                    'line-clamp-3 text-base text-opacity-80 max-w-xl',
                                    topPick
                                        ? 'text-base text-current text-opacity-60'
                                        : '',
                                )}>
                                {post?.excerpt}
                            </Text>
                        </div>
                    </Link>
                </div>
            </div>

            <div>
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
                        author={post?.author}
                        readTime={post?.readTime}
                        className='text-opacity-70 text-current'
                        date={new Date(post?.publishedAt).toDateString()}
                    />
                )}
            </div>
        </div>
    )
}
export default PostCard
