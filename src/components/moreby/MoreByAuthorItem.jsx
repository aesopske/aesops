import React from 'react'
import { Badge, Box, Heading, HStack, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MoreByAuthorItem({ post }) {
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Link href={`/fables/${post?.slug}`} passHref>
                <Heading
                    mb='0.5rem'
                    fontSize='md'
                    fontWeight='medium'
                    color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                    cursor='pointer'>
                    {post?.title}
                </Heading>
            </Link>
            <HStack gap='5px' alignItems='flex-start' flexWrap='wrap'>
                {post?.tags &&
                    post?.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                            key={index}
                            textTransform='capitalize'
                            borderRadius='full'
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
                            p='5px'
                            fontWeight='500'
                            colorScheme='purple'>
                            {tag}
                        </Badge>
                    ))}
            </HStack>
        </Box>
    )
}

MoreByAuthorItem.defaultProps = {
    post: {},
}

export default MoreByAuthorItem
