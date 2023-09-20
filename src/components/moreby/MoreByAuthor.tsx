import React from 'react'
import {
    Box,
    Heading,
    Grid,
    Text,
    useColorMode,
    Divider,
    Center,
} from '@chakra-ui/react'

import { ARTICLE, USER } from '@/types'
import MoreByAuthorItem from './MoreByAuthorItem'

type MoreByAuthorProps = {
    user: USER | null
    posts: ARTICLE[]
    current: ARTICLE | null
}

function MoreByAuthor({ user, posts, current }: MoreByAuthorProps) {
    const { colorMode } = useColorMode()
    const filtered = posts && posts.filter((post) => post?._id !== current?._id)
    return (
        <Box
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            p='30px'
            width='100%'
            borderRadius='10px'>
            <Heading fontSize='xl' fontWeight='semibold'>
                More from {user?.name}
            </Heading>
            <Divider my='1rem' />
            <Box height='auto'>
                <Grid gap='1rem'>
                    {filtered &&
                        filtered.map((post) => (
                            <MoreByAuthorItem key={post._id} post={post} />
                        ))}
                </Grid>
                {!filtered.length && (
                    <Center flexDirection='column' height='100%'>
                        <Text fontSize='sm' fontWeight='400'>
                            😧
                        </Text>
                        <Text mt='1rem' fontSize='md'>
                            Can&apos;t find more fables by {user?.name}
                        </Text>
                    </Center>
                )}
            </Box>
        </Box>
    )
}

export default MoreByAuthor
