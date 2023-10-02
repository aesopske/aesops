import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Box, Text, Heading, useColorMode, Stack } from '@chakra-ui/react'
import readTime from 'reading-time'
import MarkdownReader from '../common/MarkdownReader'
import UserAvatar from '../common/UserAvatar'
import { useGa } from '@/src/context/TrackingProvider'
import useDimensions from 'react-cool-dimensions'
import AesopImage from '../common/AesopImage'

function FeaturedCard({ article, isMobile }) {
    const { gaEvent } = useGa()
    const { colorMode } = useColorMode()
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
        <Box height='100%' minWidth={isMobile && ['100%', '70%', '70%', '50%']}>
            <Link href={`/articles/${article?.slug}`} passHref>
                <Stack
                    direction='column'
                    onClick={() => {
                        gaEvent(
                            'Article',
                            'Clicked Featured Article',
                            article?.title
                        )
                    }}
                    justifyContent='space-between'
                    alignItems='flex-start'
                    height='100%'
                    spacing='4'
                    cursor='pointer'>
                    <Box ref={observe} height='40vh' width='100%'>
                        <AesopImage
                            src={article.image.url}
                            alt={`${article?.title}-${article.image.pubId}`}
                            fallbackSrc={
                                colorMode === 'light'
                                    ? 'images/placeholderthumbnail.png'
                                    : '/images/placeholderthumbnail-dark.png'
                            }
                            borderRadius='lg'
                            objectFit='cover'
                            width={width || 600}
                            height={height || 400}
                        />
                    </Box>

                    <Heading fontSize='2xl'>{article?.title}</Heading>
                    <Box>
                        <Text
                            as='p'
                            fontSize='lg'
                            noOfLines='3'
                            lineHeight='1.8rem'>
                            <MarkdownReader content={article?.summary} />
                        </Text>
                    </Box>

                    <UserAvatar user={user} align='center' />
                </Stack>
            </Link>
        </Box>
    )
}

export default FeaturedCard
