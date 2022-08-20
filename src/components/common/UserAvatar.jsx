import React from 'react'
import { Avatar, Text, HStack, useColorMode, VStack } from '@chakra-ui/react'

function UserAvatar({
    user,
    size = 'sm',
    align = 'center',
    onSurface = false,
}) {
    const { colorMode } = useColorMode()
    return (
        <HStack alignItems={align}>
            <Avatar
                size={size}
                name={user?.name}
                src={user.photoURL}
                borderRadius='10px'
            />
            <VStack
                direction='column'
                alignItems='flex-start'
                spacing='0'
                justifyContent='space-between'>
                <Text
                    fontWeight='600'
                    fontSize='md'
                    textTransform='capitalize'
                    color={
                        colorMode === 'light'
                            ? onSurface
                                ? 'gray.100'
                                : 'gray.600'
                            : 'gray.400'
                    }>
                    {user?.name.toLowerCase()}
                </Text>
                {user?.read ? (
                    <Text
                        fontSize='sm'
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
                        fontSize='sm'
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
            </VStack>
        </HStack>
    )
}

export default UserAvatar
