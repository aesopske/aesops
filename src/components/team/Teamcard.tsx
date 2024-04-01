import React from 'react'
import {
    Box,
    Text,
    Stack,
    VStack,
    HStack,
    Avatar,
    Heading,
    IconButton,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react'
import Modall from '../common/Modall'
import { FaStickyNote, FaLinkedin } from 'react-icons/fa'

import { USER } from '@/types'

interface user extends USER {
    image: string
}

interface TeamcardProps {
    profile: user
}

function Teamcard({ profile }: TeamcardProps) {
    const { colorMode } = useColorMode()
    const { isOpen, onClose, onOpen } = useDisclosure()
    return (
        <>
            <Modall
                size='xl'
                onClose={onClose}
                isOpen={isOpen}
                title={profile?.name}>
                <Box height='auto' borderRadius='10px'>
                    <Text
                        as='p'
                        fontSize='md'
                        color={colorMode === 'light' ? '#555' : 'gray.300'}>
                        {profile?.description}
                    </Text>
                </Box>
            </Modall>
            <VStack
                borderRadius='20px'
                justifyItems='space-between'
                alignItems='start'
                height='auto'
                shadow='md'
                bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                position='relative'>
                <Stack
                    w='full'
                    direction={['column', 'column']}
                    alignItems='center'
                    gap='1rem'
                    my='1rem'
                    height='auto'
                    p='10px 20px'
                    borderRadius='0 0 20px 20px'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}>
                    <Avatar
                        width='150px'
                        height='200px'
                        borderRadius='xl'
                        alt={profile?.name}
                        src={profile?.image}
                    />

                    <Stack
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems={['center']}>
                        <Heading
                            font='bold'
                            fontSize='xl'
                            textAlign={['center', 'center', 'left']}
                            textTransform='capitalize'>
                            {profile?.name}
                        </Heading>
                        <HStack>
                            <IconButton
                                as='button'
                                type='button'
                                onClick={onOpen}
                                icon={<FaStickyNote />}
                                name={`More details about ${profile.name}`}
                                rounded='lg'
                                size='md'
                            />
                            <IconButton
                                as='a'
                                href={profile?.links?.linkedin || '#'}
                                icon={<FaLinkedin />}
                                name={`${profile.name} linkedIn profile`}
                                rounded='lg'
                                size='md'
                            />
                        </HStack>
                    </Stack>
                </Stack>
                <Box
                    height='2vh'
                    w='full'
                    bgImage={
                        colorMode === 'light'
                            ? '/images/background.png'
                            : '/svg/hero-dark.svg'
                    }
                    bgSize='cover'
                    bgRepeat='no-repeat'
                    bgPosition='center'
                    borderRadius='0 0 20px 20px'
                />
            </VStack>
        </>
    )
}

export default Teamcard
