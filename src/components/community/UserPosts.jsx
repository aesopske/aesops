import {
    Box,
    Heading,
    ListItem,
    UnorderedList,
    useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'

function UserPosts({ posts = [] }) {
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Heading size='md'>Fables : {posts.length}</Heading>
            <Box>
                <UnorderedList mt='0.5rem'>
                    {posts &&
                        posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/fables/${post?.slug}`}
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
