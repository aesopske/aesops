import React from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import readTime from 'reading-time'
import MarkdownReader from '../common/MarkdownReader'
import {
    Text,
    Heading,
    Box,
    useColorMode,
    Stack,
    VStack,
} from '@chakra-ui/react'
import UserAvatar from '../common/UserAvatar'
import { useGa } from '@/src/context/TrackingProvider'
import useMeasure from 'react-cool-dimensions'
import AesopImage from '../common/AesopImage'

function ArticlesCard({ article }) {
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
                        height={height || 400}
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
