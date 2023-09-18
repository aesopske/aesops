import React from 'react'
import { Avatar, Text, HStack, useColorMode, VStack } from '@chakra-ui/react'

import useOptimize from '@/hooks/useOptimize'

type user = {
    name: string
    date: string
    read?: string
    photoURL?: string
}

type UserAvatarProps = {
    user: user | null
    size?: string
    align?: string
    onSurface?: boolean
}

function UserAvatar({
    user,
    size = 'sm',
    align = 'center',
    onSurface = false,
}: UserAvatarProps) {
    const { colorMode } = useColorMode()
    const lightMode = colorMode === 'light'
    const { optimizedSrc } = useOptimize(user?.photoURL)
    return (
        <HStack alignItems={align} fontFamily='Roboto'>
            <Avatar
                size={size}
                name={user?.name}
                src={optimizedSrc}
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
                        lightMode
                            ? onSurface
                                ? 'gray.100'
                                : 'gray.600'
                            : 'gray.300'
                    }>
                    {user?.name.toLowerCase()}
                </Text>
                {user?.read ? (
                    <Text
                        fontSize='sm'
                        color={
                            lightMode
                                ? onSurface
                                    ? 'gray.100'
                                    : 'gray.600'
                                : 'gray.400'
                        }>
                        {user?.date} &bull; {user?.read}
                    </Text>
                ) : (
                    <Text
                        fontSize='sm'
                        fontWeight='400'
                        color={
                            colorMode === 'light'
                                ? onSurface
                                    ? 'gray.100'
                                    : 'gray.600'
                                : 'gray.400'
                        }>
                        {user?.date}
                    </Text>
                )}
            </VStack>
        </HStack>
    )
}

export default UserAvatar
