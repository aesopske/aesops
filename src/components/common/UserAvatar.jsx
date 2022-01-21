import React from 'react'
import {
    Avatar,
    Text,
    HStack,
    Box,
    Stack,
    useColorMode,
} from '@chakra-ui/react'

function UserAvatar({
    user,
    size = 'md',
    align = 'flex-start',
    onSurface = false,
}) {
    const { colorMode } = useColorMode()
    return (
        <HStack alignItems={align}>
            <Avatar
                size={size}
                name={user?.name}
                src={user.photoURL}
                borderRadius='15px'
            />
            <Box
                as={Stack}
                direction='column'
                alignItems='flex-start'
                justifyContent='space-between'>
                <Text
                    fontWeight='600'
                    size='sm'
                    textTransform='capitalize'
                    color={
                        colorMode === 'light'
                            ? onSurface
                                ? 'gray.100'
                                : 'gray.600'
                            : 'gray.400'
                    }>
                    {user?.name}
                </Text>
                {user?.read ? (
                    <Text
                        as='small'
                        fontSize='.85rem'
                        color={
                            colorMode === 'light'
                                ? onSurface
                                    ? 'gray.100'
                                    : 'gray.600'
                                : 'gray.500'
                        }>
                        {user?.date} &bull; {user?.read}
                    </Text>
                ) : (
                    <Text
                        as='small'
                        fontSize='.85rem'
                        color={
                            colorMode === 'light'
                                ? onSurface
                                    ? 'gray.100'
                                    : 'gray.600'
                                : 'gray.500'
                        }>
                        {user?.date}
                    </Text>
                )}
            </Box>
        </HStack>
    )
}

export default UserAvatar
