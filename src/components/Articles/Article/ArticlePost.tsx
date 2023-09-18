import React, { useEffect, useState } from 'react'
import {
    Box,
    Heading,
    Text,
    Badge,
    useColorMode,
    HStack,
    Stack,
} from '@chakra-ui/react'
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

type ArticlePostProps = {
    article: ARTICLE | null
    authorArticles: ARTICLE[]
}

function ArticlePost({
    article = null,
    authorArticles = [],
}: ArticlePostProps) {
    const router = useRouter()
    const { colorMode } = useColorMode()
    const [read, setRead] = useState(null)
    const [config, setConfig] = useState({})
    const date = new Date(article.created).toDateString()

    useEffect(() => {
        if (article.body) {
            const { text } = readTime(article.body)
            setRead(text)
        }

        setConfig({
            url: window.location.href,
            identifier: article._id,
            title: article.title,
        })
    }, [article.body, article._id, article.title])

    const user = {
        name: article.author,
        date,
        read: read,
        photoURL: article.author_image,
    }

    const user2 = {
        name: article.author,
        email: article.author_email,
    }

    const { observe, width, height } = useMeasure()

    const Tags = () => {
        return (
            <HStack flexWrap='wrap' gap='5px' alignItems='flex-start'>
                {article?.tags &&
                    article?.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            fontSize='sm'
                            cursor='pointer'
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
                            }}
                            p='10px'
                            colorScheme='purple'
                            fontWeight='500'
                            borderRadius='full'
                            textTransform='capitalize'>
                            {tag}
                        </Badge>
                    ))}
            </HStack>
        )
    }

    return (
        <Box
            my='.5rem'
            p='10px'
            width={['100%', '100%', '90%', '80%', '75%']}
            mx='auto'>
            <Stack direction={['column', 'column', 'row', 'row']} spacing='8'>
                <Box width={['100%', '', '', '65%']}>
                    <Box my='1rem'>
                        <Heading
                            fontSize='3xl'
                            my='1rem'
                            textTransform='capitalize'>
                            {article?.title}
                        </Heading>
                        <UserAvatar user={user} align='center' size='md' />
                    </Box>

                    {article?.image && (
                        <Box
                            ref={observe}
                            width='100%'
                            height={['40vh', '40vh', '40vh', '40vh', '60vh']}
                            my='1rem'>
                            <AesopImage
                                src={article.image?.url}
                                alt={article?.title}
                                borderRadius='10px'
                                width={width || 600}
                                height={height || 600}
                                objectFit='cover'
                                layout='responsive'
                                fallbackSrc='/images/placeholder.png'
                            />
                        </Box>
                    )}

                    <Tags />
                    <Text
                        fontSize='lg'
                        lineHeight='2'
                        textAlign='justify'
                        p={['10px', '10px', '0', '0', '0']}
                        fontFamily='Roboto Serif'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                        my='1rem'>
                        <MarkdownReader content={article?.body} />
                    </Text>

                    <Box mt='2rem'>
                        <DiscussionEmbed shortname='aesops' config={config} />
                    </Box>
                </Box>
                <Box width={['100%', '100%', '35%']} position='relative'>
                    <Stack
                        flexDir='column'
                        position='sticky'
                        top='1rem'
                        left='0'
                        width='100%'
                        alignItems='flex-start'
                        justifyContent='flex-start'
                        height='auto'
                        spacing='3'
                        mt={['1rem', '2rem', '3rem', '5rem', '8rem']}>
                        <Share title={article?.title} />
                        <MoreByAuthor
                            user={user2}
                            posts={authorArticles}
                            current={article}
                        />
                        <RecommendedList title={article?.title} />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    )
}

export default ArticlePost
