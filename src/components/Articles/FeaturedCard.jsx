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

function FeaturedCard({ article }) {
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
        <Box height='100%'>
            <Link href={`/articles/${article?.slug}`} passHref>
                <Stack
                    direction='column'
                    justifyContent='space-between'
                    alignItems='flex-start'
                    height='100%'
                    cursor='pointer'>
                    <Box height='25vh' width='100%'>
                        <Image
                            src={article.image && article.image.url}
                            alt={article?.title}
                            fallbackSrc='/images/placeholder.png'
                            borderRadius='10px'
                            objectFit='cover'
                            width='100%'
                            height='100%'
                        />
                    </Box>

                    <Box>
                        <Heading
                            fontSize={[
                                '1.2rem',
                                '1.2rem',
                                '1.2rem',
                                '1.2rem',
                                '1.3rem',
                            ]}
                            textTransform='capitalize'
                            my='1rem'>
                            {article?.title}
                        </Heading>
                        <Text
                            as='p'
                            my='1rem'
                            color={
                                colorMode === 'light'
                                    ? '#555'
                                    : 'whiteAlpha.700'
                            }
                            noOfLines={[2, 2, 3, 3, 5]}>
                            <MarkdownReader content={article?.summary} />
                        </Text>
                    </Box>

                    <UserAvatar user={user} />
                </Stack>
            </Link>
        </Box>
    )
}

export default FeaturedCard
