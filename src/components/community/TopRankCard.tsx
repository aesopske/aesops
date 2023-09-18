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
import { BiDetail } from 'react-icons/bi'
import { FaCrown, FaEnvelope } from 'react-icons/fa'

import ProfileDetails from './ProfileDetails'
import { USER, APP, ARTICLE, DATASET } from '@/types'

type Details = {
    apps: APP[]
    posts: ARTICLE[]
    datasets: DATASET[]
}

type TopRankCardProps = {
    profile: USER
    details: Details
}

function TopRankCard({ profile, details }: TopRankCardProps) {
    const { colorMode } = useColorMode()
    const { isOpen, onClose, onOpen } = useDisclosure()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? (profile?.photourl.url as string)
            : (profile?.photourl as string)

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
                    src={src}
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
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    aria-label='Show details'
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
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    aria-label='Contact'
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
