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

function ArticlesCard({ article }) {
    const { colorMode } = useColorMode()
    const { title, image, author, created, body, summary, slug, tags } = article
    const date = format(new Date(created), 'MMM dd')
    const { text } = readTime(body && body)

    const user = {
        name: author,
        date,
        read: text,
        photoURL: article?.author_image,
    }

    return (
        <Stack
            my='1rem'
            height={['auto', 'auto', '', '', '30vh']}
            width='100%'
            spacing='5'
            direction={['column', 'column', 'row-reverse', 'row-reverse']}>
            <Box
                width={['100%', '100%', '40%', '35%', '30%']}
                height={['35vh', '40vh', '40vh', '30vh', '30vh', '35vh']}>
                <Link href={`/fables/${slug}`} passHref>
                    <Image
                        borderRadius='10px'
                        src={image?.url}
                        alt={title}
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

            <VStack
                height='100%'
                mx='1rem'
                width={['100%', '100%', '60%', '65%', '70%']}
                colSpan={[1, 1, 1, 2]}
                alignItems='flex-start'
                justifyContent='space-between'
                p='10px 0'>
                <Box>
                    <Link
                        href={{
                            pathname: `/fables/${slug}`,
                        }}
                        passHref>
                        <Heading
                            cursor='pointer'
                            fontSize='lg'
                            textTransform='capitalize'>
                            {title}
                        </Heading>
                    </Link>

                    <Text
                        as='p'
                        fontSize='1rem'
                        width='100%'
                        my='1rem'
                        color={
                            colorMode === 'light'
                                ? 'gray.200'
                                : 'whiteAlpha.700'
                        }
                        noOfLines={[2, 2, 3]}>
                        <MarkdownReader content={summary} />
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
                        {tags &&
                            tags.slice(0, 2).map((tag) => (
                                <Badge
                                    key={tag}
                                    borderRadius='5px'
                                    colorScheme='purple'
                                    fontWeight='500'
                                    p='5px'
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
