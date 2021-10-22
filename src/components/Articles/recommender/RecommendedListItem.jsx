import React from 'react'
import { format } from 'date-fns'
import readTime from 'reading-time'
import Link from 'next/link'
import UserAvatar from '../../common/UserAvatar'
import { Box, Heading, Image, Stack } from '@chakra-ui/react'

function RecommendedListItem({ item }) {
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
            direction={['column', 'column', 'column', 'row']}
            alignItems='flex-start'
            width='100%'
            justifyContent='flex-start'
            my='1rem'
            height='auto'
            minHeight='12vh'>
            {item?.image && (
                <Image
                    src={item?.image.url}
                    alt={item?.title}
                    width={['100%', '100px']}
                    height='100%'
                    borderRadius='10px'
                    fallbackSrc='/images/placeholder.png'
                    objectFit='cover'
                />
            )}

            <Box
                ml={item?.image && '1rem'}
                as={Stack}
                alignItems='flex-start'
                height='100%'
                p='10px'
                justifyContent='space-between'>
                <Link href={{ pathname: `/articles/${item?.slug}` }} passHref>
                    <Heading
                        size='sm'
                        cursor='pointer'
                        fontWeight='600'
                        my={['.5rem', '.5rem', '.5rem', '0']}>
                        {item?.title}
                    </Heading>
                </Link>
                <UserAvatar user={user} size='sm' />
            </Box>
        </Box>
    )
}

export default RecommendedListItem
