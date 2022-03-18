import React from 'react'
import { format } from 'date-fns'
import readTime from 'reading-time'
import Link from 'next/link'
import UserAvatar from '../../common/UserAvatar'
import { Badge, Box, Heading, Stack } from '@chakra-ui/react'

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
            direction='column'
            alignItems='flex-start'
            width='100%'
            justifyContent='flex-start'
            my='1rem'
            height='auto'>
            <Box
                as={Stack}
                alignItems='flex-start'
                height='auto'
                justifyContent='space-between'>
                <Link href={{ pathname: `/fables/${item?.slug}` }} passHref>
                    <Heading
                        fontSize='sm'
                        textTransform='capitalize'
                        cursor='pointer'
                        fontWeight='600'
                        mb='0.5rem'>
                        {item?.title}
                    </Heading>
                </Link>
                <Box>
                    {item?.tags &&
                        item?.tags.map((tag, index) => (
                            <Badge
                                key={index}
                                mb='5px'
                                mr='5px'
                                textTransform='capitalize'
                                borderRadius='5px'
                                p='5px'
                                fontWeight='500'
                                colorScheme='purple'>
                                {tag}
                            </Badge>
                        ))}
                </Box>
                <UserAvatar user={user} size='sm' />
            </Box>
        </Box>
    )
}

export default RecommendedListItem
