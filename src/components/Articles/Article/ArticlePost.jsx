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
} from '@chakra-ui/react'
import UserAvatar from '../../common/UserAvatar'
import MoreByAuthor from '../../moreby/MoreByAuthor'

function ArticlePost({ article = {}, authorArticles = [] }) {
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
            <Box>
                {article.tags &&
                    article.tags.length &&
                    article.tags.map((tag, index) => (
                        <Badge
                            mr='1rem'
                            key={index}
                            fontSize='0.9rem'
                            p='5px'
                            fontWeight='500'
                            borderRadius='5px'
                            textTransform='capitalize'>
                            # {tag}
                        </Badge>
                    ))}
            </Box>
        )
    }

    return (
        <>
            <Box
                my='.5rem'
                p='10px'
                width={['100%', '100%', '90%', '80%', '70%']}
                mx='auto'>
                <Grid
                    gap='4rem'
                    templateColumns={[
                        'repeat(1,1fr)',
                        'repeat(1,1fr)',
                        'repeat(2,1fr)',
                        'repeat(3,1fr)',
                        'repeat(3,1fr)',
                    ]}>
                    <Box as={GridItem} colSpan={[1, 1, 2, 2, 2, 2]}>
                        <Box my='1rem'>
                            <Heading size='lg' my='1rem'>
                                {article?.title}
                            </Heading>
                            <UserAvatar user={user} />
                        </Box>

                        <Box
                            width='100%'
                            height={['40vh', '40vh', '50vh']}
                            my='2rem'>
                            <Image
                                src={article.image?.url}
                                alt='article'
                                borderRadius='20px'
                                width='100%'
                                height='100%'
                                objectFit='cover'
                                fallbackSrc='/images/placeholder.png'
                            />
                        </Box>

                        <Tags />
                        <Text
                            a='p'
                            fontSize='1rem'
                            letterSpacing='wide'
                            lineHeight='9'
                            className='paragraph'
                            color={colorMode === 'light' ? '#555' : 'gray.300'}
                            my='1rem'>
                            <MarkdownReader content={article?.body} />
                        </Text>

                        <Box mt='2rem'>
                            <DiscussionEmbed
                                shortname='aesops'
                                config={config}
                            />
                        </Box>
                    </Box>
                    <Box p={['0', '0', '0', '0 20px']}>
                        <Grid
                            gap='4'
                            templateColumns='repeat(1,1fr)'
                            width='100%'
                            height='auto'
                            mt={['1rem', '2rem', '3rem', '5rem', '9.5rem']}>
                            <Share title={article?.title} />
                            <RecommendedList title={article?.title} />
                            <MoreByAuthor user={user2} posts={authorArticles} />
                        </Grid>
                    </Box>
                </Grid>
            </Box>
        </>
    )
}

ArticlePost.defaultProps = {
    article: {},
}

export default ArticlePost
