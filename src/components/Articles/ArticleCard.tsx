'use client'

import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import readTime from 'reading-time'
import useMeasure from 'react-cool-dimensions'
import Text from '../common/atoms/Text'
import Heading from '../common/atoms/Heading'

import { ARTICLE } from '@/types'
import UserAvatar from '../common/UserAvatar'
import AesopImage from '../common/AesopImage'
import { useGa } from '@/context/TrackingProvider'

type ArticlesCardProps = {
    article: ARTICLE
}

function ArticlesCard({ article }: ArticlesCardProps) {
    const { gaEvent } = useGa()

    const date = format(new Date(article?.created), 'MMM dd')
    const { text } = readTime(article?.body)

    const user = {
        name: article?.author,
        date,
        read: text,
        photoURL: article?.author_image,
    }
    const { observe, width, height } = useMeasure()

    return (
        <Link
            href={`/articles/${article?.slug}`}
            onClick={() => {
                gaEvent({
                    category: 'Articles',
                    action: 'clicked on Article Title',
                    label: article?.title,
                })
            }}
            passHref>
            <div className='flex items-start gap-2 flex-col w-full md:flex-row-reverse md:justify-between '>
                <div
                    ref={observe}
                    className='relative w-56 h-40 rounded-lg overflow-hidden cursor-pointer'>
                    <AesopImage
                        src={
                            article?.image?.url ??
                            '/images/placeholderthumbnail.png'
                        }
                        alt={article?.title}
                        width={width || 300}
                        height={height || 300}
                        className='rounded-lg cursor-pointer object-cover w-full h-full'
                    />
                </div>

                <div className='flex flex-col gap-3 w-full md:w-3/4'>
                    <div className='max-w-lg'>
                        <Heading
                            type='h3'
                            className='cursor-pointer font-bold capitalize'>
                            {article?.title}
                        </Heading>

                        <Text
                            className='line-clamp-3 my-2'
                            dangerouslySetInnerHTML={{
                                __html: article?.summary ?? '',
                            }}
                        />
                    </div>

                    <UserAvatar user={user} />
                </div>
            </div>
        </Link>
    )
}

export default ArticlesCard
