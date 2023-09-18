import {
    Box,
    Heading,
    ListItem,
    UnorderedList,
    useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'

import { ARTICLE } from '@/types'

type UserPostsProps = {
    posts: ARTICLE[]
}

function UserPosts({ posts = [] }: UserPostsProps) {
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Heading size='md'>Articles : {posts.length}</Heading>
            <Box>
                <UnorderedList mt='0.5rem'>
                    {posts &&
                        posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/articles/${post?.slug}`}
                                passHref>
                                <ListItem
                                    _hover={{
                                        textDecor: 'underline',
                                        color:
                                            colorMode === 'light'
                                                ? 'brand.primary'
                                                : 'brand.muted',
                                    }}
                                    cursor='pointer'>
                                    {post?.title}
                                </ListItem>
                            </Link>
                        ))}
                </UnorderedList>
            </Box>
        </Box>
    )
}

UserPosts.defaultProps = {
    posts: [],
}

export default UserPosts
