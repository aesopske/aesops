import { cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS } from '@sanity/utils/types'
import AuthorDetails from '../organisms/author-card/AuthorDetails'

type GroupAvatarProps = {
    group: AUTHOR_PLUS[]
    background?: 'default' | 'light' | 'primary' | 'secondary'
}

const backgroundVariants = cva(
    'flex items-center w-fit h-fit bg-white p-0.5 rounded-full z-10',
    {
        variants: {
            background: {
                default: 'bg-brandaccent-50',
                light: 'bg-white',
                primary: 'bg-brandprimary-700',
                secondary: 'bg-brandaccent-500',
            },
        },
        defaultVariants: {
            background: 'default',
        },
    },
)

function GroupAvatar({ group, background = 'default' }: GroupAvatarProps) {
    return (
        <div className='flex -space-x-2 overflow-hidden bg-brandaccent-50'>
            {group.map((author) => (
                <div
                    key={author.name}
                    className={cn(backgroundVariants({ background }))}>
                    <AuthorDetails author={author} isSmaller />
                </div>
            ))}
        </div>
    )
}

export default GroupAvatar
