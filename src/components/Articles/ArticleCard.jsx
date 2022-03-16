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
    Grid,
    GridItem,
    useColorMode,
    Stack,
    HStack,
    Badge,
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
        <Grid
            gap='1rem'
            templateColumns={[
                'repeat(1, 1fr)',
                'repeat(1, 1fr)',
                'repeat(2, 1fr)',
                'repeat(3, 1fr)',
            ]}
            my='1rem'
            width='100%'>
            {image?.url && (
                <Box
                    as={Link}
                    href={`/fables/${slug}`}
                    width='100%'
                    height='auto'
                    passHref>
                    <Image
                        borderRadius='20px'
                        src={image?.url}
                        alt={title}
                        objectFit='cover'
                        width='100%'
                        height={[
                            '35vh',
                            '40vh',
                            '40vh',
                            '30vh',
                            '30vh',
                            '35vh',
                        ]}
                        fallbackSrc={
                            colorMode === 'light'
                                ? 'images/placeholderthumbnail.png'
                                : '/images/placeholderthumbnail-dark.png'
                        }
                    />
                </Box>
            )}
            <GridItem
                as={Stack}
                height='100%'
                mx='1rem'
                width='100%'
                colSpan={[1, 1, 1, 2]}
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
                            mb='1rem'
                            textTransform='capitalize'>
                            {title}
                        </Heading>
                    </Link>
                    <HStack spacing='1' flexWrap='wrap' mb='0.5rem'>
                        {tags &&
                            tags.map((tag) => (
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

                    <Text
                        as='p'
                        fontSize='1rem'
                        width='90%'
                        my='1rem'
                        color={
                            colorMode === 'light' ? '#555' : 'whiteAlpha.700'
                        }
                        noOfLines={[2, 2, 3]}>
                        <MarkdownReader content={summary} />
                    </Text>
                </Box>

                <UserAvatar user={user} />
            </GridItem>
        </Grid>
    )
}

export default ArticlesCard
