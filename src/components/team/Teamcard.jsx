import React from 'react'
import {
    Box,
    Text,
    Stack,
    VStack,
    HStack,
    Heading,
    IconButton,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image'
import Modall from '../common/Modall'
import { FaStickyNote, FaLinkedin } from 'react-icons/fa'

function Teamcard({ profile }) {
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
                    direction={['column', 'column', 'row']}
                    alignItems='center'
                    my='1rem'
                    height='auto'
                    p='10px 20px'
                    borderRadius='0 0 20px 20px'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}>
                    <Box
                        h={['20vh', '25vh', '15vh']}
                        w={['60%', '60%', '50%', '30%']}>
                        <Image
                            width={200}
                            height={400}
                            alt={profile?.name}
                            src={profile?.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: '10px',
                                scale: '0.9',
                            }}
                        />
                    </Box>
                    <Stack
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems={['center', 'start']}>
                        <Heading
                            font='bold'
                            mt='0.5rem'
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
