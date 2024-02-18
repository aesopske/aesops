import React, { useEffect, useState } from 'react'

import readTime from 'reading-time'
import { useRouter } from 'next/router'
import useMeasure from 'react-cool-dimensions'
import { DiscussionEmbed } from 'disqus-react'

import { ARTICLE } from '@/types'
import Share from '../../common/ShareBtns'
import UserAvatar from '../../common/UserAvatar'
import AesopImage from '../../common/AesopImage'
import MoreByAuthor from '../../moreby/MoreByAuthor'
import MarkdownReader from '../../common/MarkdownReader'
import RecommendedList from '../recommender/RecommendedList'
import { Badge } from '@/components/ui/badge'
import Heading from '@/components/common/atoms/Heading'

type ArticlePostProps = {
    article: ARTICLE | null
    authorArticles: ARTICLE[]
}

function ArticlePost({ article, authorArticles = [] }: ArticlePostProps) {
    const router = useRouter()
    const [read, setRead] = useState(null)
    const [config, setConfig] = useState({})
    const date = new Date(article?.created ?? '').toDateString()

    useEffect(() => {
        if (article?.body) {
            const { text } = readTime(article?.body)
            setRead(text)
        }

        setConfig({
            url: window.location.href,
            identifier: article?._id,
            title: article?.title,
        })
    }, [article?.body, article?._id, article?.title])

    const user = {
        name: article?.author ?? 'Author',
        date,
        read: read,
        photoURL: article?.author_image ?? '',
    }

    const user2 = {
        name: article?.author ?? 'Author',
        email: article?.author_email ?? '',
    }

    const { observe, width, height } = useMeasure()

    const Tags = () => {
        return (
            <div className='flex items-center flex-wrap gap-2 my-4'>
                {article?.tags &&
                    article?.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            role='button'
                            variant='primary'
                            aria-label='tag'
                            className='cursor-pointer text-sm rounded-full py-2 px-4 bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-300 ease-in-out'
                            onClick={() => {
                                router.push(
                                    {
                                        pathname: '/articles',
                                        query: { category: tag },
                                    },
                                    `/articles?category=${tag}`,
                                    {
                                        shallow: true,
                                    }
                                )
                            }}>
                            {tag}
                        </Badge>
                    ))}
            </div>
        )
    }

    return (
        <div className=' relative container-fluid mx-auto max-w-screen-xl w-full px-6 pb-28 grid grid-cols-3 gap-20'>
            <div className='w-full col-span-2 max-w-4xl relative'>
                <div className='my-4 flex flex-col gap-2'>
                    <Heading className='capitalize md:text-4xl'>
                        {article?.title}
                    </Heading>
                    <UserAvatar user={user} />
                </div>

                {article?.image && (
                    <div
                        ref={observe}
                        className='w-full h-96 rounded-xl object-cover overflow-hidden border border-gray-200'>
                        <AesopImage
                            src={
                                article.image?.url ?? '/images/placeholder.png'
                            }
                            alt={article?.title}
                            width={width || 600}
                            height={height || 600}
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </div>
                )}

                <Tags />
                <MarkdownReader content={article?.body ?? ''} />

                <div className='mt-4'>
                    <DiscussionEmbed shortname='aesops' config={config} />
                </div>
            </div>
            <div className='relative w-full'>
                <div className='flex flex-col gap-3 lg:sticky lg:top-20 lg:pt-10 lg:pl-0 lg:left-0 lg:w-full lg:items-start lg:justify-start lg:h-auto lg:mt-8'>
                    <MoreByAuthor
                        user={user2}
                        posts={authorArticles}
                        current={article}
                    />
                    <RecommendedList title={article?.title} />
                    <Share title={article?.title} />
                </div>
            </div>
        </div>
    )
}

export default ArticlePost
