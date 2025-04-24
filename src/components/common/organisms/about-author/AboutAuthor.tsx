'use client'

import { Fragment, useState } from 'react'
import ListWrapper from '@src/components/common/ListWrapper'
import { Button } from '@src/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import { cn } from '@src/lib/utils'
import { AUTHOR_PLUS, POST } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import Socials from '@components/common/organisms/author-card/Socials'
import SmallPostCard from '@components/common/organisms/posts/SmallPostCard'

type AboutAuthorProps = {
    author: AUTHOR_PLUS
    hideBio?: boolean
    hidePosts?: boolean
    hideSocials?: boolean
    largeProfile?: boolean
}

function AboutAuthor({
    author,
    hideBio,
    hidePosts,
    hideSocials,
    largeProfile,
}: AboutAuthorProps) {
    const [showMore, setShowMore] = useState(false)

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }
    return (
        <div className='space-y-5'>
            <div className='flex items-center w-full gap-2'>
                <Avatar
                    className={cn('border h-20 w-20', {
                        'lg:w-36 lg:h-36': largeProfile,
                    })}>
                    <AvatarImage
                        src={author.photoURL}
                        alt={author?.name}
                        className='object-cover object-top'
                    />
                    <AvatarFallback>{author?.initials}</AvatarFallback>
                </Avatar>
            </div>
            <div className='space-y-2'>
                <div>
                    <Heading type='h4' className='font-bold capitalize'>
                        {author?.name}
                    </Heading>
                    {author?.isCoreMember ? (
                        <div className='flex items-center gap-1 text-gray-100'>
                            <Role role={author?.role ?? ''} />
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <Text as='span' className='text-sm text-gray-500'>
                                Community Member
                            </Text>
                        </div>
                    )}
                </div>
                {!author?.bio || hideBio ? null : (
                    <div className=' text-brandprimary-900/70 relative'>
                        <Text
                            className={cn(
                                'text-base font-light lg:text-sm line-clamp-6',
                                { 'line-clamp-none': showMore },
                            )}>
                            {author?.bio}
                        </Text>
                        <div
                            className={cn(
                                'absolute bottom-0 right-0 bg-linear-to-b from-transparent via-brand-background to-brand-background w-full flex items-end justify-start min-h-20',
                                { 'relative min-h-0': showMore },
                            )}>
                            <Button
                                variant='link'
                                onClick={toggleShowMore}
                                className='p-0 hover:underline underline-offset-4 hover:decoration-dashed text-brandprimary-700'>
                                {showMore ? 'Read less...' : 'Read more...'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {hidePosts || author?.posts?.length === 0 ? null : (
                <div className='flex flex-col gap-2'>
                    <Heading type='h4' className='font-semibold'>
                        More posts by author
                    </Heading>

                    <ListWrapper list={author?.posts ?? []} itemKey='_key'>
                        {(post: POST) => (
                            <SmallPostCard hideAuthor post={post} />
                        )}
                    </ListWrapper>
                </div>
            )}

            {hideSocials ? null : <Socials socials={author.socials ?? []} />}
        </div>
    )
}

function Role({ role }: { role: string }) {
    // check if split role is an array
    if (!role) return null

    const splitRole = role.split('|')

    return Array.isArray(splitRole) ? (
        <Text as='span' className='text-sm text-gray-500'>
            {splitRole.map((role: string, idx: number) => (
                <Fragment key={role}>
                    {role}{' '}
                    {idx < splitRole.length - 1 ? <span>&bull;</span> : ''}
                </Fragment>
            ))}
        </Text>
    ) : (
        <Text as='span' className='text-sm text-gray-500'>
            {role}
        </Text>
    )
}
export default AboutAuthor
