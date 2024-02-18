'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import readTime from 'reading-time'
import useDimensions from 'react-cool-dimensions'

import { ARTICLE } from '@/types'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'

import UserAvatar from '../common/UserAvatar'
import AesopImage from '../common/AesopImage'
import { useGa } from '@/context/TrackingProvider'
import MarkdownReader from '../common/MarkdownReader'

type FeaturedCardProps = {
    article: ARTICLE
}

function FeaturedCard({ article }: FeaturedCardProps) {
    const { gaEvent } = useGa()
    const { text } = readTime(article?.body)

    const date = format(new Date(article?.created), 'MMM dd')

    const user = {
        name: article?.author,
        date,
        read: text,
        photoURL: article?.author_image,
    }

    const { observe, width, height } = useDimensions()

    return (
        <div className='w-full h-full my-0 p-0'>
            <Link href={`/articles/${article?.slug}`} passHref>
                <div
                    role='button'
                    className='flex flex-col w-full h-full justify-between items-start gap-3 cursor-pointer'
                    onClick={() => {
                        gaEvent(
                            'Article',
                            'Clicked Featured Article',
                            article?.title
                        )
                    }}>
                    <div ref={observe} className='w-full h-72'>
                        <AesopImage
                            src={
                                article?.image?.url ??
                                '/images/placeholderthumbnail.png'
                            }
                            alt={`${article?.title}-${article?.image?.pub_id}`}
                            width={width || 600}
                            height={height || 600}
                            className='rounded-xl object-cover border border-gray-200 w-full h-full'
                        />
                    </div>

                    <Heading type='h4' className='capitalize font-bold'>
                        {article?.title}
                    </Heading>

                    <Text
                        className='line-clamp-2'
                        dangerouslySetInnerHTML={{
                            __html: article?.summary ?? '',
                        }}
                    />

                    <UserAvatar user={user} />
                </div>
            </Link>
        </div>
    )
}

export default FeaturedCard
