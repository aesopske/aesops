import React from 'react'
import { format } from 'date-fns'
import readTime from 'reading-time'
import Link from 'next/link'
import UserAvatar from '../../common/UserAvatar'
import { Divider, Stack, Text, useColorMode } from '@chakra-ui/react'

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
        <Stack
            direction='column'
            alignItems='flex-start'
            width='100%'
            justifyContent='flex-start'
            spacing={3}
            height='auto'>
            <Stack
                dir='column'
                alignItems='flex-start'
                height='auto'
                spacing='3'
                justifyContent='space-between'>
                <Link href={{ pathname: `/articles/${item?.slug}` }} passHref>
                    <Text
                        fontSize='lg'
                        color={colorMode === 'light' ? 'gray.700' : 'gray.300'}
                        cursor='pointer'>
                        {item?.title}
                    </Text>
                </Link>
                <UserAvatar user={user} size='sm' />
            </Stack>
            <Divider />
        </Stack>
    )
}

export default RecommendedListItem
