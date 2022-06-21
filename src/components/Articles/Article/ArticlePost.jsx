import React, { useEffect, useState } from 'react'
import Share from '../../common/ShareBtns'
import { DiscussionEmbed } from 'disqus-react'
import RecommendedList from '../recommender/RecommendedList'
import readTime from 'reading-time'
import MarkdownReader from '../../common/MarkdownReader'
import {
    Box,
    Heading,
    Text,
    Grid,
    Badge,
    Image,
    GridItem,
    useColorMode,
    HStack,
    Stack,
} from '@chakra-ui/react'
import UserAvatar from '../../common/UserAvatar'
import MoreByAuthor from '../../moreby/MoreByAuthor'
import { useRouter } from 'next/router'

function ArticlePost({ article = {}, authorArticles = [] }) {
    const router = useRouter()
    const { colorMode } = useColorMode()
    const [read, setRead] = useState(null)
    const [config, setConfig] = useState({})
    const date = new Date(article.created).toDateString()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (article.body) {
                const { text } = readTime(article.body)
                setRead(text)
            }

            setConfig({
                url: window.location.href,
                identifier: article._id,
                title: article.title,
            })
        }
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
                                        pathname: '/fables',
                                        query: { category: tag },
                                    },
                                    `/fables?category=${tag}`,
                                    {
                                        shallow: true,
                                    }
                                )
                            }}
                            p='5px 10px'
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
            width={['100%', '100%', '90%', '80%']}
            mx='auto'>
            <Stack direction={['column', 'column', 'row', 'row']} spacing='8'>
                <Box width={['100%', '', '', '60%']}>
                    <Box my='1rem'>
                        <Heading
                            fontSize='2xl'
                            my='1rem'
                            textTransform='capitalize'>
                            {article?.title}
                        </Heading>
                        <UserAvatar user={user} align='center' />
                    </Box>

                    {article?.image && (
                        <Box
                            width='100%'
                            height={['40vh', '40vh', '40vh', '40vh', '60vh']}
                            my='1rem'>
                            <Image
                                src={article.image?.url}
                                alt='article'
                                borderRadius='10px'
                                width='100%'
                                height='100%'
                                objectFit='cover'
                                fallbackSrc='/images/placeholder.png'
                            />
                        </Box>
                    )}

                    <Tags />
                    <Text
                        a='p'
                        fontSize='md'
                        lineHeight='1.7'
                        textAlign='justify'
                        className='paragraph'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                        my='1rem'>
                        <MarkdownReader content={article?.body} />
                    </Text>

                    <Box mt='2rem'>
                        <DiscussionEmbed shortname='aesops' config={config} />
                    </Box>
                </Box>
                <Box
                    width={['100%', '100%', '40%']}
                    colSpan={1}
                    position='relative'>
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

ArticlePost.defaultProps = {
    article: {},
}

export default ArticlePost
