import { cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS } from '@sanity/utils/types'
import AuthorDetails, {
    AUTHOR_DETAIL_PROPS,
} from '../organisms/author-card/AuthorDetails'

type GroupAvatarProps = {
    group: AUTHOR_PLUS[]
    background?: 'default' | 'light' | 'primary' | 'secondary'
} & AUTHOR_DETAIL_PROPS

const backgroundVariants = cva(
    'flex items-center w-fit h-fit p-0 rounded-full z-10',
    {
        variants: {
            background: {
                default: 'bg-white',
                light: 'bg-brandaccent-50',
                primary: 'bg-brandprimary-700',
                secondary: 'bg-brandaccent-500',
            },
        },
        defaultVariants: {
            background: 'default',
        },
    },
)

function GroupAvatar({
    group,
    background = 'default',
    ...props
}: GroupAvatarProps) {
    return (
        <div className='flex -space-x-4 overflow-hidden'>
            {group.map((author) => (
                <div
                    key={author.name}
                    className={cn(backgroundVariants({ background }))}>
                    <AuthorDetails
                        {...props}
                        author={author}
                        isMultiple={group.length > 1}
                    />
                </div>
            ))}
        </div>
    )
}

export default GroupAvatar
