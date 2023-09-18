import React from 'react'
import {
    Box,
    Heading,
    Avatar,
    Text,
    Stack,
    useColorMode,
} from '@chakra-ui/react'

import { USER } from '@/types'

interface user extends USER {
    image: string
}

interface TeamcardProps {
    profile: user
}

function Teamcard({ profile }: TeamcardProps) {
    const { colorMode } = useColorMode()
    return (
        <Box
            borderRadius='20px'
            border='1px solid'
            borderColor={colorMode === 'light' ? '#eee' : 'gray.700'}
            height='auto'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            position='relative'
            minHeight='20vh'>
            <Box
                height='10vh'
                bgImage={
                    colorMode === 'light'
                        ? '/images/background.png'
                        : '/svg/hero-dark.svg'
                }
                bgSize='cover'
                bgRepeat='no-repeat'
                bgPosition='center'
                borderRadius='20px 20px 0 0'
            />

            <Avatar
                name={profile?.name}
                src={profile?.image}
                size='2xl'
                position='absolute'
                borderRadius='30px'
                left='50%'
                top={['13%', '13%', '', '13%', '13%']}
                transform='translate(-50%,-15%)'
            />
            <Box
                height='auto'
                bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                p='20px'
                my='1rem'
                borderRadius='0 0 20px 20px'>
                <Box
                    mt='2rem'
                    as={Stack}
                    height='100%'
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='center'>
                    <Heading
                        my='0.5rem'
                        fontSize='2xl'
                        textAlign='center'
                        textTransform='capitalize'>
                        {profile?.name}
                    </Heading>
                    <Text
                        as='p'
                        textAlign='center'
                        fontSize='lg'
                        color={colorMode === 'light' ? '#555' : 'gray.300'}>
                        {profile?.description}
                    </Text>
                    <Text
                        as='p'
                        mt='0.5rem'
                        mb='2rem'
                        textAlign='center'
                        textTransform='capitalize'
                        color={colorMode === 'light' ? '#555' : 'gray.300'}>
                        {profile?.occupation}
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}

export default Teamcard
