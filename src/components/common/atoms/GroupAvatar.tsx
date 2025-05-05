import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS } from '@sanity/utils/types'
import AuthorDetails, {
    AUTHOR_DETAIL_PROPS,
} from '../organisms/author-card/AuthorDetails'

const backgroundVariants = cva(
    'flex items-center w-fit h-fit p-0 rounded-full z-10',
    {
        variants: {
            background: {
                default: 'bg-white',
                light: 'bg-brandaccent-50',
                primary: 'bg-brandprimary-700',
                secondary: 'bg-brandaccent-500',
                dark: 'bg-brandprimary-900',
                transparent: 'bg-transparent',
            },
        },
        defaultVariants: {
            background: 'default',
        },
    },
)

interface GroupAvatarProps
    extends AUTHOR_DETAIL_PROPS,
        VariantProps<typeof backgroundVariants> {
    group: AUTHOR_PLUS[]
}

function GroupAvatar({
    group,
    background = 'default',
    ...props
}: GroupAvatarProps) {
    // reverse the group since the main author is at the beginning.
    const reversedGroup = group.reverse()
    return (
        <div className='flex -space-x-4 overflow-hidden'>
            {reversedGroup.map((author) => (
                <div
                    key={author.name}
                    className={cn(
                        'bg-blue-400',
                        backgroundVariants({ background }),
                    )}>
                    <AuthorDetails
                        {...props}
                        author={author}
                        isMultiple={group.length > 1}
                        className='bg-transparent'
                    />
                </div>
            ))}
        </div>
    )
}

export default GroupAvatar
