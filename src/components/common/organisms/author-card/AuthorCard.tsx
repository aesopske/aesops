import { format } from 'date-fns'
import React from 'react'
import Heading from '@/components/common/atoms/Heading'
import Text from '@/components/common/atoms/Text'
import { cn } from '@src/lib/utils'
import { formatAuthor } from '@sanity/utils/formatAuthor'
import { AUTHOR } from '@sanity/utils/types'
import ListWrapper from '../../ListWrapper'
import GroupAvatar from '../../atoms/GroupAvatar'

type AuthorCardProps = {
    author: AUTHOR[]
    readTime?: number
    date: string
    isSmall?: boolean
    hideDetails?: boolean
    hideCoAuthor?: boolean
    avatarBackground?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'dark'
        | 'light'
        | 'transparent'
} & React.HTMLAttributes<HTMLDivElement>

function AuthorCard({
    date,
    author,
    isSmall,
    readTime,
    className,
    hideDetails,
    avatarBackground = 'default',
    hideCoAuthor = true,
}: AuthorCardProps) {
    const authors =
        author?.length > 0 ? author.map((auth) => formatAuthor(auth)) : []
    const formattedDate = format(date, 'MMM dd, yyyy')

    const mainAuthor = authors[0]
    const otherAuthors = hideCoAuthor ? [] : authors.slice(1)

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <GroupAvatar
                group={authors}
                hideDetails={hideDetails}
                background={avatarBackground}
            />

            <div className='flex flex-1 flex-col items-start justify-between gap-0'>
                <Heading
                    type='h6'
                    className={cn(
                        'font-bold capitalize',
                        isSmall && 'text-sm',
                    )}>
                    {mainAuthor?.name.toLowerCase()}
                </Heading>
                <div
                    className={cn('flex items-center w-full', {
                        'justify-between gap-5': otherAuthors?.length > 0,
                    })}>
                    <div className='flex items-center gap-1'>
                        {otherAuthors?.length > 0 && (
                            <Text
                                as='span'
                                className='text-sm text-current text-opacity-20'>
                                {otherAuthors.length > 0 && 'Co-author'} &bull;
                            </Text>
                        )}
                        <ListWrapper list={otherAuthors} itemKey='name'>
                            {(author, idx) => (
                                <Text
                                    as='span'
                                    className='text-sm text-current text-opacity-20'>
                                    {author.name}
                                    {idx < otherAuthors.length - 1 && ','}
                                </Text>
                            )}
                        </ListWrapper>
                    </div>
                    {readTime ? (
                        <Text as='small' className='text-sm text-current'>
                            {formattedDate} &bull; {readTime} min read
                        </Text>
                    ) : (
                        <Text
                            as='small'
                            className='text-sm text-current text-opacity-20'>
                            {formattedDate}
                        </Text>
                    )}
                </div>
            </div>
        </div>
    )
}
export default AuthorCard
