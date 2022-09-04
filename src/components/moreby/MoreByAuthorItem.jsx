import React from 'react'
import { Divider, HStack, Text, useColorMode, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function MoreByAuthorItem({ post }) {
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <VStack spacing='2' alignItems='flex-start'>
            <Link href={`/articles/${post?.slug}`} passHref>
                <Text
                    fontSize='lg'
                    fontFamily='Roboto'
                    color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                    cursor='pointer'>
                    {post?.title}
                </Text>
            </Link>
            <HStack spacing='2' alignItems='flex-start' flexWrap='wrap'>
                {post?.tags &&
                    post?.tags.slice(0, 2).map((tag, index) => (
                        <Text
                            key={index}
                            textTransform='capitalize'
                            fontSize='md'
                            cursor='pointer'
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
                            color={
                                colorMode === 'light' ? 'gray.500' : 'gray.300'
                            }>
                            # {tag}
                        </Text>
                    ))}
            </HStack>
            <Divider my='.5rem' />
        </VStack>
    )
}

MoreByAuthorItem.defaultProps = {
    post: {},
}

export default MoreByAuthorItem
