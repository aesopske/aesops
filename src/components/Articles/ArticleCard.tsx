import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import readTime from 'reading-time'
import {
    Text,
    Heading,
    Box,
    useColorMode,
    Stack,
    VStack,
} from '@chakra-ui/react'
import useMeasure from 'react-cool-dimensions'

import { ARTICLE } from '@/types'
import UserAvatar from '../common/UserAvatar'
import AesopImage from '../common/AesopImage'
import { useGa } from '@/context/TrackingProvider'
import MarkdownReader from '../common/MarkdownReader'

type ArticlesCardProps = {
    article: ARTICLE
}

function ArticlesCard({ article }: ArticlesCardProps) {
    const { gaEvent } = useGa()
    const { colorMode } = useColorMode()

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
        <Stack
            height='auto'
            width='100%'
            spacing='6'
            p='10px'
            maxHeight={['auto', 'auto', 'auto', 'auto', '20vh', '20vh']}
            direction={['column', 'column', 'row-reverse', 'row-reverse']}>
            <Box
                ref={observe}
                width={['100%', '100%', '40%', '35%', '30%']}
                height={['30vh', '30vh', 'auto']}
                maxHeight='inherit'>
                <Link href={`/articles/${article?.slug}`} passHref>
                    <AesopImage
                        borderRadius='lg'
                        src={article?.image?.url}
                        alt={article?.title}
                        objectFit='cover'
                        width={width || 600}
                        height={height || 600}
                        layout='responsive'
                        fallbackSrc={
                            colorMode === 'light'
                                ? 'images/placeholderthumbnail.png'
                                : '/images/placeholderthumbnail-dark.png'
                        }
                    />
                </Link>
            </Box>

            <VStack
                spacing='3'
                height='auto'
                alignItems='flex-start'
                justifyContent='space-between'
                width={['100%', '100%', '60%', '65%', '70%']}>
                <Box>
                    <Link
                        href={{
                            pathname: `/articles/${article?.slug}`,
                        }}
                        passHref>
                        <Heading
                            cursor='pointer'
                            fontSize='2xl'
                            onClick={() => {
                                gaEvent(
                                    'Articles',
                                    'clicked on Article Title',
                                    article?.title
                                )
                            }}>
                            {article?.title}
                        </Heading>
                    </Link>

                    <Text
                        as='p'
                        fontSize='lg'
                        fontWeight='light'
                        width='100%'
                        my='1rem'
                        lineHeight='1.8rem'
                        color={colorMode === 'light' ? 'gray.200' : 'gray.500'}
                        noOfLines={[2, 2, 3]}>
                        <MarkdownReader content={article?.summary} />
                    </Text>
                </Box>

                <UserAvatar user={user} align='center' />
            </VStack>
        </Stack>
    )
}

export default ArticlesCard
