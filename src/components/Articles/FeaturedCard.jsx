import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
    Image,
    Box,
    Text,
    Heading,
    useColorMode,
    Stack,
} from '@chakra-ui/react'
import readTime from 'reading-time'
import MarkdownReader from '../common/MarkdownReader'
import UserAvatar from '../common/UserAvatar'
import { useGa } from '@/src/context/TrackingProvider'

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

    return (
        <Box height='100%' minWidth={isMobile && ['100%', '80%', '50%']}>
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
                    cursor='pointer'>
                    <Box height='35vh' width='100%'>
                        <Image
                            src={article.image && article.image.url}
                            alt={article?.title}
                            fallbackSrc={
                                colorMode === 'light'
                                    ? 'images/placeholderthumbnail.png'
                                    : '/images/placeholderthumbnail-dark.png'
                            }
                            borderRadius='10px'
                            objectFit='cover'
                            width='100%'
                            height='100%'
                        />
                    </Box>

                    <Heading fontSize='xl'  my='1rem'>
                        {article?.title}
                    </Heading>
                    <Box>
                        <Text
                            as='p'
                            my='1rem'
                            fontSize={['md', '', '', 'lg', 'lg']}
                            color={
                                colorMode === 'light'
                                    ? 'gray.300'
                                    : 'whiteAlpha.700'
                            }
                            noOfLines='3'>
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
