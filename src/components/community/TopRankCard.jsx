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
    useDisclosure,
} from '@chakra-ui/react'
import { FaCrown, FaEnvelope } from 'react-icons/fa'
import { BiDetail } from 'react-icons/bi'
import ProfileDetails from './ProfileDetails'
import useOptimize from '../hooks/useOptimize'

function TopRankCard({ profile, details }) {
    const { colorMode } = useColorMode()
    const { isOpen, onClose, onOpen } = useDisclosure()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? profile?.photourl.url
            : profile?.photourl

    const { optimizedSrc } = useOptimize(src)

    return (
        <>
            <ProfileDetails
                isOpen={isOpen}
                onClose={onClose}
                profile={profile}
                details={details}
            />
            <Box
                borderRadius='20px'
                shadow='xl'
                height='auto'
                className={
                    colorMode === 'light' ? 'glass-effect' : 'glass-effect-dark'
                }
                position='relative'
                minWidth={['100%', '100%', '70%', '70%', '70%', '80%']}
                minHeight='20vh'>
                <Box height='10vh' bg='transparent' />

                <Avatar
                    name={profile?.name}
                    src={optimizedSrc}
                    size='xl'
                    position='absolute'
                    left='50%'
                    top='15%'
                    borderRadius='20px'
                    transform='translate(-50%,-10%)'>
                    <AvatarBadge boxSize='1em' bg='orange.300'>
                        <Icon as={FaCrown} fontSize='1rem' color='#fff' />
                    </AvatarBadge>
                </Avatar>
                <Box
                    height='auto'
                    minHeight='20vh'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px'
                    borderRadius='0 0 20px 20px'>
                    <Box
                        mt='2rem'
                        as={Stack}
                        height='100%'
                        direction='column'
                        spacing='2'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            fontSize='2xl'
                            textAlign='center'
                            textTransform='capitalize'>
                            {profile?.name}
                        </Heading>

                        <Text
                            as='p'
                            mb='2rem'
                            fontSize={['md', '', '', 'lg', 'lg']}
                            textAlign='center'
                            textTransform='capitalize'
                            color={colorMode === 'light' ? '#555' : 'gray.400'}>
                            {profile?.occupation}
                        </Text>
                        <HStack mt='1rem'>
                            <Tooltip
                                label='Show details'
                                hasArrow
                                closeOnMouseDown
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    onClick={onOpen}
                                    _active={{ outline: 'none' }}
                                    _focus={{ outline: 'none' }}
                                    icon={<BiDetail />}
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    colorScheme='brand'
                                />
                            </Tooltip>
                            <Tooltip
                                label='Contact'
                                hasArrow
                                closeOnMouseDown
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    href={`mailto:${profile.email}`}
                                    rel='noopener noreferer'
                                    target='_blank'
                                    _active={{ outline: 'none' }}
                                    _focus={{ outline: 'none' }}
                                    icon={<FaEnvelope />}
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    colorScheme='brand'
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
