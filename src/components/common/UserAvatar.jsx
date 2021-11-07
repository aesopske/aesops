import React from 'react'
import { Avatar, Text, HStack, Box, Stack } from '@chakra-ui/react'

function UserAvatar({ user, size = 'md', align = 'flex-start' }) {
    return (
        <HStack alignItems={align}>
            <Avatar size={size} name={user?.name} src={user.photoURL} />
            <Box
                as={Stack}
                direction='column'
                alignItems='flex-start'
                justifyContent='space-between'>
                <Text fontWeight='600' size='sm' textTransform='capitalize'>
                    {user?.name}
                </Text>
                <Text as='small' fontSize='.85rem'>
                    {user?.date} &bull; {user?.read}
                </Text>
            </Box>
        </HStack>
    )
}

export default UserAvatar
