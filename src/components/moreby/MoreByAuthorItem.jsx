import React from 'react'
import { Badge, Box, Heading, HStack, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MoreByAuthorItem({ post }) {
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Link href={`/articles/${post?.slug}`} passHref>
                <Heading
                    mb='0.5rem'
                    fontSize='md'
                    textTransform='capitalize'
                    fontWeight='semibold'
                    color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                    cursor='pointer'>
                    {post?.title}
                </Heading>
            </Link>
            <HStack
                gap='5px'
                spacing='1'
                alignItems='flex-start'
                flexWrap='wrap'>
                {post?.tags &&
                    post?.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                            key={index}
                            textTransform='capitalize'
                            borderRadius='full'
                            fontSize='sm'
                            onClick={() => {
                                router.push(
                                    {
                                        pathname: '/articles',
                                        query: { category: tag },
                                    },
                                    `/articles?category=${tag}`,
                                    {
                                        shallow: true,
                                    }
                                )
                            }}
                            p='10px'
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
