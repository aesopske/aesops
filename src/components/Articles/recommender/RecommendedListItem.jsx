import React from 'react'
import { format } from 'date-fns'
import readTime from 'reading-time'
import Link from 'next/link'
import UserAvatar from '../../common/UserAvatar'
import { Box, Heading, Stack, useColorMode } from '@chakra-ui/react'

function RecommendedListItem({ item }) {
    const { colorMode } = useColorMode()
    const date = format(new Date(item?.created), 'MMM dd')
    const { text } = readTime(item?.body)

    const user = {
        name: item?.author,
        date,
        read: text,
        photoURL: item?.author_image,
    }

    return (
        <Box
            as={Stack}
            direction='column'
            alignItems='flex-start'
            width='100%'
            justifyContent='flex-start'
            height='auto'>
            <Stack
                dir='column'
                alignItems='flex-start'
                height='auto'
                spacing='1'
                justifyContent='space-between'>
                <Link href={{ pathname: `/articles/${item?.slug}` }} passHref>
                    <Heading
                        fontSize={['md', 'md']}
                        mb='0.5rem'
                        textTransform='capitalize'
                        cursor='pointer'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}
                        fontWeight='semibold'>
                        {item?.title}
                    </Heading>
                </Link>
                <UserAvatar user={user} size='sm' />
            </Stack>
        </Box>
    )
}

export default RecommendedListItem
