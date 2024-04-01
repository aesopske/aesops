import Link from 'next/link'

import { cn } from '@src/lib/utils'
import Text from '../../atoms/Text'
import { titleCase } from '@src/lib/titleCase'
import { Badge } from '@src/components/ui/badge'
import { MIN_POST, POST } from '@sanity/lib/types'
import AuthorCard from '../author-card/AuthorCard'
import Heading from '@components/common/atoms/Heading'

type postCardProps = {
    post: POST | MIN_POST
    hideAuthor?: boolean
    className?: string
    hideImage?: boolean
    hideCategory?: boolean
    orientation?: 'horizontal' | 'vertical'
}

function PostCard({
    post,
    hideAuthor,
    className,
    hideCategory = false,
    orientation = 'vertical',
}: postCardProps) {
    const categories = post.categories ?? []
    const isHorizontal = orientation === 'horizontal'

    return (
        <div
            className={cn(
                '  bg-white border border-gray-200 p-4 rounded text-aes-dark h-full space-y-6',
                className
            )}>
            <div className='flex gap-2 flex-wrap'>
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
                            type={isHorizontal ? 'h4' : 'h3'}
                            className={cn('font-black text-2xl ')}>
                            {titleCase(post.title)}
                        </Heading>
                        <Text className='line-clamp-3 text-sm text-opacity-80 max-w-xl'>
                            {post.excerpt}
                        </Text>
                    </div>
                </Link>
                {hideAuthor ? (
                    <p className='text-sm text-opacity-70'>
                        <span>
                            {new Date(post?.publishedAt).toDateString()}
                        </span>{' '}
                        &bull; <span>{post?.readTime} min read</span>
                    </p>
                ) : (
                    <AuthorCard
                        isSmall
                        author={post.author}
                        readTime={post.readTime}
                        className='text-opacity-70'
                        date={new Date(post.publishedAt).toDateString()}
                    />
                )}
            </div>
        </div>
    )
}
export default PostCard
