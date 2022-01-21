import React from 'react'
import {
    Box,
    Heading,
    Avatar,
    Text,
    AvatarBadge,
    Icon,
    IconButton,
    Stack,
    HStack,
    Tooltip,
    useColorMode,
} from '@chakra-ui/react'
import { FaCrown, FaEnvelope } from 'react-icons/fa'
import { BiDetail } from 'react-icons/bi'

function TopRankCard({ profile }) {
    const { colorMode } = useColorMode()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? profile?.photourl.url
            : profile?.photourl

    return (
        <>
            <Box
                borderRadius='20px'
                shadow='xl'
                height='auto'
                className={
                    colorMode === 'light' ? 'glass-effect' : 'glass-effect-dark'
                }
                position='relative'
                minHeight='20vh'>
                <Box height='10vh' bg='transparent' />

                <Avatar
                    name={profile?.name}
                    src={src}
                    size='2xl'
                    position='absolute'
                    bg={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                    left='50%'
                    top='10%'
                    transform='translate(-50%,-10%)'>
                    <AvatarBadge boxSize='1.25em' bg='orange.300'>
                        <Icon as={FaCrown} fontSize='1.2rem' color='#fff' />
                    </AvatarBadge>
                </Avatar>
                <Box
                    height='auto'
                    minHeight='20vh'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px'
                    borderRadius='0 0 20px 20px'>
                    <Box
                        mt='4rem'
                        as={Stack}
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            fontSize='1.5rem'
                            textAlign='center'
                            textTransform='capitalize'>
                            {profile?.name}
                        </Heading>

                        <Text
                            as='p'
                            mt='.5rem'
                            mb='2rem'
                            textAlign='center'
                            textTransform='capitalize'
                            color={colorMode === 'light' ? '#555' : 'gray.400'}>
                            {profile?.occupation}
                        </Text>
                        <HStack>
                            <Tooltip
                                label='Send email'
                                hasArrow
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    href={`mailto:${profile.email}`}
                                    rel='noopener noreferer'
                                    target='_blank'
                                    icon={<FaEnvelope />}
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    bg={
                                        colorMode === 'light'
                                            ? 'purple.100'
                                            : 'gray.600'
                                    }
                                    color={
                                        colorMode === 'light'
                                            ? 'brand.primary'
                                            : 'brand.muted'
                                    }
                                />
                            </Tooltip>
                            <Tooltip
                                label='Send email'
                                hasArrow
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    href={`mailto:${profile.email}`}
                                    rel='noopener noreferer'
                                    target='_blank'
                                    icon={<BiDetail />}
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    bg={
                                        colorMode === 'light'
                                            ? 'purple.100'
                                            : 'gray.600'
                                    }
                                    color={
                                        colorMode === 'light'
                                            ? 'brand.primary'
                                            : 'brand.muted'
                                    }
                                />
                            </Tooltip>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default TopRankCard
