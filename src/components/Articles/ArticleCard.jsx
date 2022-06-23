import React from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import readTime from 'reading-time'
import MarkdownReader from '../common/MarkdownReader'
import {
    Image,
    Text,
    Heading,
    Box,
    useColorMode,
    Stack,
    HStack,
    Badge,
    VStack,
} from '@chakra-ui/react'
import UserAvatar from '../common/UserAvatar'
import { useGa } from '@/src/context/TrackingProvider'

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

    return (
        <Stack
            height={['auto', 'auto', '', '', '30vh', '25vh']}
            width='100%'
            spacing='3'
            direction={['column', 'column', 'row-reverse', 'row-reverse']}>
            {article?.image?.url && (
                <Box
                    width={['100%', '100%', '40%', '35%', '30%']}
                    height={['35vh', '40vh', '40vh', '30vh', '30vh', '25vh']}>
                    <Link href={`/articles/${article?.slug}`} passHref>
                        <Image
                            borderRadius='10px'
                            src={article?.image?.url}
                            alt={article?.title}
                            objectFit='cover'
                            width='100%'
                            height='100%'
                            fallbackSrc={
                                colorMode === 'light'
                                    ? 'images/placeholderthumbnail.png'
                                    : '/images/placeholderthumbnail-dark.png'
                            }
                        />
                    </Link>
                </Box>
            )}

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
                            fontSize={['xl', 'xl', '2xl', '2xl', '2xl']}
                            onClick={() => {
                                gaEvent(
                                    'Articles',
                                    'clicked on Article Title',
                                    article?.title
                                )
                            }}
                            textTransform='capitalize'>
                            {article?.title}
                        </Heading>
                    </Link>

                    <Text
                        as='p'
                        fontSize='lg'
                        fontWeight='light'
                        width='100%'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.200' : 'gray.500'}
                        noOfLines={[2, 2, 3]}>
                        <MarkdownReader content={article?.summary} />
                    </Text>
                </Box>

                <Stack
                    justifyContent='space-between'
                    alignItems={['flex-start', 'flex-start', '', '', 'center']}
                    direction={['column', 'column', '', 'row', 'row']}
                    spacing='5'
                    width='100%'>
                    <UserAvatar user={user} align='center' />
                    <HStack spacing='1' flexWrap='wrap' mb='0.5rem'>
                        {article?.tags &&
                            article?.tags.slice(0, 2).map((tag) => (
                                <Badge
                                    key={tag}
                                    borderRadius='full'
                                    colorScheme='purple'
                                    fontWeight='500'
                                    p='10px'
                                    fontSize={['sm', '', '', '', 'md']}
                                    textTransform='capitalize'>
                                    {tag}
                                </Badge>
                            ))}
                    </HStack>
                </Stack>
            </VStack>
        </Stack>
    )
}

export default ArticlesCard
