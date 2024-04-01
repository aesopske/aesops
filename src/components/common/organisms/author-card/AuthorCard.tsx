import { AUTHOR } from '@sanity/lib/types'
import AuthorDetails from './AuthorDetails'
import Text from '@/components/common/atoms/Text'
import { formatAuthor } from '@src/lib/sanity/formatAuthor'
import { cn } from '@src/lib/utils'
import { format } from 'date-fns'
import React from 'react'

type AuthorCardProps = {
    author: AUTHOR
    readTime?: number
    date: string
    isSmall?: boolean
} & React.HTMLAttributes<HTMLDivElement>

function AuthorCard({
    date,
    author,
    isSmall,
    readTime,
    className,
}: AuthorCardProps) {
    const newAuthor = formatAuthor(author)

    const formattedDate = format(new Date(date), 'MMM dd, yyyy')
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <AuthorDetails author={newAuthor} isSmall={isSmall} />
            <div className='flex flex-1 flex-col items-start justify-between gap-0'>
                <Text
                    className={cn(
                        'font-semibold capitalize',
                        isSmall && 'text-sm'
                    )}>
                    {author?.name.toLowerCase()}
                </Text>
                {readTime ? (
                    <Text className='text-xs'>
                        {formattedDate} &bull; {readTime} min read
                    </Text>
                ) : (
                    <Text className='text-xs'>{formattedDate}</Text>
                )}
            </div>
        </div>
    )
}
export default AuthorCard
