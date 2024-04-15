import { AUTHOR } from '@sanity/lib/types'
import AuthorDetails from './AuthorDetails'
import Text from '@/components/common/atoms/Text'
import Heading from '@/components/common/atoms/Heading'
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
                <Heading
                    type='h6'
                    className={cn(
                        'font-bold capitalize',
                        isSmall && 'text-sm',
                    )}>
                    {author?.name.toLowerCase()}
                </Heading>
                {readTime ? (
                    <Text as='span' className='text-xs text-current'>
                        {formattedDate} &bull; {readTime} min read
                    </Text>
                ) : (
                    <Text
                        as='span'
                        className='text-xs text-current text-opacity-20'>
                        {formattedDate}
                    </Text>
                )}
            </div>
        </div>
    )
}
export default AuthorCard
